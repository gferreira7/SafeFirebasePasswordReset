import { FirebaseError } from "firebase/app"
import { checkActionCode, confirmPasswordReset, getAuth } from "firebase/auth"
import { useEffect, useState } from "react"
import { AuthProvider, useFirebaseApp } from "reactfire"
import "./App.scss"
import useLocationHash from "./hooks/useLocationHash"
import VerifyingActionCode from "./modules/verifyingActionCode/VerifyingActionCode"
import FatalError from "./modules/fatalError/FatalError"
import PasswordChange from "./modules/passwordChange/PasswordChange"
import { SubmissionState } from "./types"
import PasswordChangeSuccess from "./modules/passwordChangeSuccess/PasswordChangeSuccess"

function App() {
  //Are we currently verifying the action code?
  const [
    actionCodeVerificationInProgress,
    setActionCodeVerificationInProgress,
  ] = useState(true)

  const actionCode = useLocationHash()["oobCode"]

  const auth = getAuth(useFirebaseApp())

  //Any error which occurs, anywhere in the process, that is fatal
  const [fatalError, setFatalError] = useState<string | null>(null)

  //Any retriable error which turned up whilst trying to submit the new password
  const [submitError, setSubmitError] = useState<string | null>(null)

  //Are we currently submitting the new password, or has it been successfully submitted?
  const [submissionState, setSubmissionState] = useState(
    SubmissionState.NOT_SUBMITTING
  )

  async function submitNewPassword(password: string) {
    setSubmissionState(SubmissionState.SUBMITTING)
    setSubmitError(null)
    try {
      await confirmPasswordReset(auth, actionCode, password)

      setSubmissionState(SubmissionState.SUCCESSFULLY_SUBMITTED)
    } catch (e) {
      setSubmissionState(SubmissionState.NOT_SUBMITTING)

      const errorCode = (e as FirebaseError).code
      switch (errorCode) {
        case "auth/expired-action-code":
          setFatalError(
            "Your email link has expired. Please try resetting your password again."
          )
          break
        case "auth/invalid-action-code":
          setFatalError(
            "Your email link was invalid or has already been used. Please try resetting your password again."
          )
          break
        case "auth/user-disabled":
          setFatalError("Your account has been disabled.")
          break
        case "auth/user-not-found":
          setFatalError("Your account could not be found.")
          break
        case "auth/weak-password":
          setSubmitError("Password is not secure enough")
          break
        default:
          setSubmitError(
            "Unable to verify your email link. Please confirm you are connected to the internet and try again."
          )
          break
      }
    }
  }

  //As soon as we have our action code (OOB), we check it to ensure it's valid
  useEffect(() => {
    setActionCodeVerificationInProgress(true)

    async function verifyActionCode() {
      setActionCodeVerificationInProgress(true)
      setFatalError(null)

      try {
        await checkActionCode(auth, actionCode)
      } catch (e) {
        const errorCode = (e as FirebaseError).code
        switch (errorCode) {
          case "auth/expired-action-code":
            setFatalError(
              "Your email link has expired. Please try resetting your password again."
            )
            break
          case "auth/invalid-action-code":
            setFatalError(
              "Your email link was invalid or has already been used. Please try resetting your password again."
            )
            break
          case "auth/user-disabled":
            setFatalError("Your account has been disabled.")
            break
          case "auth/user-not-found":
            setFatalError("Your account could not be found.")
            break
          default:
            setFatalError(
              "Unable to verify your email link. Please confirm you are connected to the internet and try again."
            )
            break
        }
        console.error("Error checking action code", e)
      } finally {
        setActionCodeVerificationInProgress(false)
      }
    }

    verifyActionCode()
  }, [auth, actionCode])

  return (
    <AuthProvider sdk={auth}>
      <div className='App'>
        <PasswordChange
          submissionState={submissionState}
          submitError={submitError}
          submitNewPassword={(password) => submitNewPassword(password)}
        />
      </div>
    </AuthProvider>
  )
}

export default App
