'use client';

import {COUNTRY, CURRENCY} from '@/lib/apis/keywords';
import {
  setCountries,
  setCurrencies,
  setCurrentCurrency,
  setLocation,
} from '@/lib/slices/currencySlice';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Link from 'next/link';

import LangSelector from '@/components/lang-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {logout} from '@/lib/slices/customerAuthSlice';
import Cookies from 'js-cookie';
import {
  Check,
  ChevronDown,
  CircleDollarSign,
  MapPin,
  SearchIcon,
  ShoppingCart,
  UserRound,
} from 'lucide-react';
import {useRouter} from 'next-nprogress-bar';
import {toast} from 'sonner';
import SearchProduct from '../search-product';
import {useToast} from '@/hooks/use-toast';

const LanguageComponent = ({
  currencies,
  countries,
  location,
  lang,
  categoryList,
}) => {
  const currencySymbol = {GBP: '£', EUR: '€', QAR: 'QR', SAR: '﷼', USD: '$'};
  const dispatch = useDispatch();
  const {toast} = useToast();

  const [search, setSearch] = useState(false);

  const {currencyList, currentCurrency, country} = useSelector(
    state => state.currencyData,
  );

  const {isLoggedIn} = useSelector(state => state.customerData);
  const {cartList} = useSelector(state => state.productData);
  const router = useRouter();

  const {message, isError, isSuccess} = useSelector(
    state => state.customerData,
  );

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${lang.lang}/`);
  };

  const handleCurrency = val => {
    Cookies.set(CURRENCY, val);
    dispatch(setCurrentCurrency(val));
  };

  useEffect(() => {
    if (isError) {
      toast(message, {
        style: {backgroundColor: 'rgb(254 226 226)', color: 'rgb(153 27 27)'},
      });
    }
    if (isSuccess) {
      toast(message, {
        style: {backgroundColor: 'rgb(34 197 94)', color: 'white'},
      });
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (currencies) {
      dispatch(setCurrencies(currencies));
    }
  }, [currencies, dispatch]);

  useEffect(() => {
    if (countries) {
      dispatch(setCountries(countries));
    }
  }, [countries, dispatch]);

  useEffect(() => {
    if (location) {
      dispatch(setLocation(location));
    }
  }, [location, dispatch]);

  return (
    <>
      <div className=" bg-black py-2">
        <div className="container ">
          <div className="flex flex-row-reverse">
            <div className="flex items-center justify-between gap-2 self-end">
              <div className="hidden sm:flex items-center text-background gap-2 px-3 py-2 w-fit">
                <MapPin className="size-5" />
                {/* {country} */}
                <span className="whitespace-nowrap text-sm lg:text-base">
                  {country}
                </span>
              </div>
              <div className="flex items-center gap-5 sm:gap-8 w-full">
                <div className=" w-full ">
                  <LangSelector lang={lang} />
                </div>

                <div>
                  {currencyList?.length > 0 && currentCurrency && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="text-background flex gap-2 items-center cursor-pointer hover:text-gray-200">
                          <CircleDollarSign className="text-background size-5" />
                          <span>{currentCurrency}</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        {currencyList?.map(currency => (
                          <DropdownMenuItem
                            key={currency}
                            onClick={() => handleCurrency(currency)}
                            className="flex items-center justify-between">
                            <span>
                              {currencySymbol[currency]} {currency}
                            </span>
                            {currency === currentCurrency && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <div className="w-full flex justify-around text-center gap-2 py-1 px-2 cursor-pointer">
                <div onClick={() => setSearch(true)}>
                  <SearchProduct
                    search={search}
                    setSearch={setSearch}
                    categoryList={categoryList}
                    lang={lang}
                    router={router}
                  />
                </div>

                {isLoggedIn ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="relative cursor-pointer">
                          <UserRound className="text-background size-5" />
                          <span className="sr-only">Open user menu</span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${lang.lang}/profile`}
                            className="w-full">
                            {lang.my_profile}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${lang.lang}/wish-list`}
                            className="w-full">
                            {lang.my_wishlist}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${lang.lang}/orders/order-listings`}
                            className="w-full">
                            {lang.my_order}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${lang.lang}/change-password`}
                            className="w-full">
                            {lang.change_password}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          {lang.logout}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div
                          className="relative cursor-pointer"
                          onClick={() =>
                            router.push(`/${lang.lang}/shopping-cart`)
                          }>
                          <ShoppingCart className="text-background size-5" />
                          {cartList && cartList?.length > 0 && (
                            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                              {cartList?.length}
                            </span>
                          )}
                        </div>
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <div>
                      <Link href={`/${lang.lang}/sign-in`}>
                        <UserRound className="text-background size-5" />
                      </Link>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="relative cursor-pointer">
                          <ShoppingCart className="text-background size-5" />

                          <span className="sr-only">Shopping cart</span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuItem>
                          <div className="w-full text-center py-2">
                            {lang.your_cart_is_empty}
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* <UnLoggedTriggerComponent /> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageComponent;
