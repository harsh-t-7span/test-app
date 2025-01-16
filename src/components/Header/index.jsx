'use client';

import Image from 'next/image';
import Link from 'next/link';
import logoImg from '@/asset/icons/logo.svg';
import {usePathname, useSearchParams} from 'next/navigation';
import LanguageComponent from './LanguageComponent';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setCategoryList} from '@/lib/slices/categorySlice';
import {Menu, X} from 'lucide-react';
import {Button} from '@/components/ui/button';

export default function Header({
  categories,
  currencies,
  countries,
  location,
  lang,
  customerData,
}) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const {categoryList} = useSelector(state => state.categoryData);
  const pathname = usePathname();

  useEffect(() => {
    if (categories) {
      dispatch(setCategoryList(categories));
    }
  }, [categories, dispatch]);

  const getIsActive = itemId => {
    const pathParts = pathname.split('/');

    return pathParts.includes(itemId.toString());
  };

  return (
    <>
      <LanguageComponent
        currencies={currencies}
        countries={countries}
        location={location}
        lang={lang}
        categoryList={categoryList}
      />
      <div className="container py-5 flex gap-10 items-center w-full">
        <div className="flex gap-5 justify-between items-center w-full">
          <Link href={`/${lang.lang}`}>
            <Image
              src={logoImg}
              width={150}
              height={60}
              alt="Logo"
              className="shrink-0"
            />
          </Link>

          <Button
            className="lg:hidden block rounded-tr-none rounded-bl-none rounded-br-xl rounded-tl-xl hover:bg-black"
            onClick={toggleMenu}>
            {isOpen ? (
              <X size={24} strokeWidth={3} />
            ) : (
              <Menu size={48} strokeWidth={3} />
            )}
          </Button>

          {categoryList?.length > 0 && (
            <div className="gap-5 flex-wrap hidden lg:flex text-neutral-700 font-semibold">
              {categoryList
                .filter(item => item.is_active == 1)
                .map(item => (
                  <div key={item.id}>
                    <Link
                      className={`nav-link ${
                        getIsActive(item.id)
                          ? ' text-primary border-b-2 border-primary'
                          : 'text-secondary hover:text-primary'
                      }`}
                      href={`/${lang.lang}/${item.url_key}/${item.id}`}>
                      {item.alternative_name}
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden fixed top-0 right-0 w-full h-full bg-rose-100 text-black z-40 
             transform transition-transform duration-300 ease-in-out flex flex-col ${
               isOpen ? 'translate-x-0' : 'translate-x-full'
             }`}>
          <Button
            variant="secondary"
            className="p-2 m-5 rounded-full z-50 rounded-tr-none rounded-bl-none rounded-br-xl rounded-tl-xl w-fit self-end"
            onClick={toggleMenu}>
            <X size={24} />
          </Button>
          <nav className="w-full h-full overflow-y-scroll flex flex-col gap-10 p-7">
            {categoryList?.length > 0 &&
              categoryList
                .filter(item => item.is_active == 1)
                .map(item => (
                  <Link
                    key={item.id}
                    onClick={toggleMenu}
                    className={`w-full nav-link ${
                      getIsActive(item.id)
                        ? 'text-primary bg-primary text-white'
                        : 'text-black hover:bg-primary hover:text-white'
                    } text-base font-semibold p-2 rounded-md transition-all duration-200 ease-in-out`}
                    href={`/${lang.lang}/${item.url_key}/${item.id}`}>
                    {item.alternative_name}
                  </Link>
                ))}
          </nav>
        </div>
      </div>
    </>
  );
}
