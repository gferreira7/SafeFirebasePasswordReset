// Import necessary libraries and styles
import React, { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { SubmissionState } from "../../types";
import "./PasswordChange.scss";
import { useTranslation } from "react-i18next";

// Define constants
const MIN_SCORE = 3;
const MIN_CHARS = 8;

// Interface for PasswordChange parameters
export interface PasswordChangeParams {
  submissionState: SubmissionState;
  submitNewPassword: (password: string) => void;
  submitError: string | null;
}

// PasswordChange component
function PasswordChange(params: PasswordChangeParams) {
  const { t } = useTranslation()

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [zxcvbnResult, setZxcvbnResult] = useState<zxcvbn.ZXCVBNResult | null>(null);
  const [passwordHeadlineError, setPasswordHeadlineError] = useState<string | null>(null);

  // Function to handle password change and update related states
  function setNewPassword(password: string) {
    setNewPassword1(password);
    const zr = zxcvbn(password);
    setZxcvbnResult(zr);

    if (password.length < MIN_CHARS) {
      setPasswordHeadlineError(`Please enter at least ${MIN_CHARS} characters`);
    } else if (zr.score < MIN_SCORE) {
      setPasswordHeadlineError(t('Password is not secure enough'));
    } else {
      setPasswordHeadlineError(null);
    }
  }

  useEffect(() => setNewPassword(""), []);

  return (
    <div className="PasswordChange">
      <h1>{t('Reset Your Password')}</h1>
      <p>{t('Thanks for confirming your email address. You can now reset your password below.')}</p>

      <label htmlFor="newPassword1">{t('New Password')}</label>
      <input type="password" id="newPassword1" value={newPassword1} onChange={(event) => setNewPassword(event.target.value)} />

      {newPassword1.length < MIN_CHARS && <p className="error">{t('Please enter at least {{MIN_CHARS}} characters', { MIN_CHARS })}</p>}

      {newPassword1.length >= MIN_CHARS && (
        <>
          {passwordHeadlineError && <p className="error">{passwordHeadlineError}</p>}
          {!passwordHeadlineError && <p className="ok">{t('Strong password')}</p>}

          {/* {zxcvbnResult?.feedback?.warning && <p className="warn">{zxcvbnResult.feedback.warning}</p>}

          {zxcvbnResult?.feedback?.suggestions?.length && (
            <ul className="suggestions">
              {zxcvbnResult.feedback.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          )} */}
        </>
      )}

      <label htmlFor="newPassword2">{t('Confirm Password')}</label>
      <input type="password" id="newPassword2" value={newPassword2} onChange={(event) => setNewPassword2(event.target.value)} />
      {newPassword2.length > 0 && newPassword1 !== newPassword2 && <p className="error">{t('Passwords do not match')}</p>}

      <button disabled={params.submissionState !== SubmissionState.NOT_SUBMITTING || !!passwordHeadlineError || newPassword1 !== newPassword2} onClick={() => params.submitNewPassword(newPassword1)}>
        {params.submissionState === SubmissionState.SUBMITTING ? t("Submitting...") : t("Submit")}
      </button>
      {params.submitError && <p className="error">{params.submitError}</p>}
    </div>
  );
}

export default PasswordChange;
