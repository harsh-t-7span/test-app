import ChangePasswordWrapper from './change-password-wrapper';
import {getLocales} from '../../../../../get-locales';

const page = async ({params}) => {
  const {lang} = params;

  const lan = await getLocales(lang);

  return (
    <>
      <ChangePasswordWrapper lang={lan} />
    </>
  );
};

export default page;
