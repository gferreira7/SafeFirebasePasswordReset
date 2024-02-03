import ok from "../../res/ok.svg";
import "./PasswordChangeSuccess.scss"
import { useTranslation } from "react-i18next";

function PasswordChangeSuccess() {
  const { t } = useTranslation()
  return (<>
    <img src={ok} alt="" />
    <h1>{t('Your password has been successfully changed')}</h1>
    <p>{t('You can now close this window and log in as usual with your new password.')}</p>
  </>);
}

export default PasswordChangeSuccess;