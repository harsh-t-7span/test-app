import ForgotPasswordWrapper from './forgot-password-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);
  return (
    <>
      <ForgotPasswordWrapper lang={lan} />
    </>
  );
};

export default page;
