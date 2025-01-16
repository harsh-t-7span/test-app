import ShoppingCart from '@/components/ShoppingCart';
import {getLocales} from '../../../../../get-locales';

export const metadata = {
  title: 'Shopping Cart - PaperCut',
  description: 'View and manage your shopping cart items',
};

export default async function CartPage({params}) {
  const {lang} = params;

  const lan = await getLocales(lang);

  return (
    <main className="min-h-screen bg-primary-gradient">
      <ShoppingCart lang={lan} />
    </main>
  );
}
