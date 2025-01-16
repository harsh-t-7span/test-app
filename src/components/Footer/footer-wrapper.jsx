'use client';
import {Facebook, Instagram, Link, MessageCircle, Twitter} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import logoImg from '@/asset/icons/logo.svg';

import {useSelector} from 'react-redux';

const FooterLink = ({href, children}) => {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-gray-900 transition-colors">
      {children}
    </a>
  );
};

const FooterSection = ({title, children}) => {
  return (
    <div className="flex flex-col lg:space-y-4 space-y-2 ">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
};

const SocialLinks = () => {
  return (
    <div className="flex lg:flex-col justify-center items-center">
      <a
        href="https://www.facebook.com/share/p/RH2gihiqEDFHzu7o/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 duration-500 rounded-full hover:bg-primary hover:text-white transition-all">
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href="https://www.instagram.com/reel/DCduShkNpXW/?igsh=MWpzN2hrenl1aTlrcw=="
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 duration-500 rounded-full hover:bg-primary hover:text-white transition-all">
        <Instagram className="w-5 h-5" />
      </a>
      <a
        href="https://wa.me/+97474749722"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 duration-500 rounded-full hover:bg-primary hover:text-white transition-all">
        <MessageCircle className="w-5 h-5" />
      </a>
    </div>
  );
};

const FooterWrapper = ({link, lang}) => {
  const currentYear = new Date().getFullYear();

  const profileLink = link.profile_link;
  const recycleLink = link.recycle_link;

  const onLinkFunc = link => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-12 sm:px-6 lg:px-8 lg:text-left text-center">
        <div className="grid grid-cols-6 lg:gap-0 gap-5 ">
          <div className="lg:col-span-1 flex justify-center lg:items-start items-center flex-col col-span-6  lg:space-y-4 space-y-2">
            <FooterLink href={`/${lang.lang}`}>
              <Image
                src={logoImg}
                width={100}
                height={90}
                alt="Logo"
                className=""
              />
            </FooterLink>
            <p className="text-sm leading-6  lg:w-40 w-48     sm:mx-0 mx-auto ">
              {lang.papercut_building_address}
            </p>
          </div>

          <div className="lg:col-span-4 col-span-6   ">
            <FooterSection title={lang.quick_link || 'Quick Links'}>
              <div className="grid sm:grid-cols-4 grid-cols-2 lg:pt-5 sm:gap-5 gap-16 sm:text-left text-sm lg:pl-5 ">
                <div className="flex flex-col sm:space-y-2 space-y-1">
                  <FooterLink href={`/${lang.lang}/about-us`}>
                    {lang.about}
                  </FooterLink>
                  <FooterLink href={`/${lang.lang}/our-mission`}>
                    {lang.our_mission}
                  </FooterLink>
                  <FooterLink href={`/${lang.lang}/our-vision`}>
                    {lang.our_vision}
                  </FooterLink>
                  <div
                    onClick={() => onLinkFunc(profileLink)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                    {lang.profile}
                  </div>
                </div>

                <div className="flex flex-col  sm:space-y-2 space-y-1">
                  <FooterLink href={`/${lang.lang}/faq`}>{lang.faq}</FooterLink>
                  <div
                    onClick={() => onLinkFunc(recycleLink)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                    {lang.recycle_waste}
                  </div>
                  <FooterLink href={`/${lang.lang}/contact-us`}>
                    {lang.contact_us}
                  </FooterLink>
                  {/* <FooterLink href={`/${lang.lang}/customer-support`}>
                    Customer Support
                  </FooterLink> */}
                  <div
                    onClick={() => {
                      window.open('https://wa.me/+97474749722', '_blank');
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                    {lang.customer_support}
                  </div>
                </div>

                <div className="flex flex-col sm:space-y-2 space-y-1">
                  <FooterLink href={`/${lang.lang}`}>
                    {lang.paper_cups || 'Paper Cups'}
                  </FooterLink>
                  <FooterLink href={`/${lang.lang}`}>
                    {lang.paper_bags || 'Paper Bags'}
                  </FooterLink>
                  <FooterLink href={`/${lang.lang}`}>{lang.rpet}</FooterLink>
                  <FooterLink href={`/${lang.lang}`}>{lang.pla}</FooterLink>
                </div>

                <div className="flex flex-col  sm:space-y-2 space-y-1">
                  <FooterLink href={`/${lang.lang}`}>
                    {lang.consumables || 'Consumables'}
                  </FooterLink>

                  <FooterLink href={`/${lang.lang}`}>
                    {lang.containers || 'Containers'}
                  </FooterLink>

                  <FooterLink href={`/${lang.lang}`}>
                    {lang.sugarcane_containers || 'Sugarcane Containers'}
                  </FooterLink>
                  <FooterLink href={`/${lang.lang}`}>
                    {lang.stationery || 'Stationery'}
                  </FooterLink>
                </div>
              </div>
            </FooterSection>
          </div>

          <div className="col-span-6    lg:col-span-1 text-center">
            <FooterSection title={lang.follow_us || 'Follow Us'}>
              <div className="lg:pt-4 pt-0">
                <SocialLinks />
              </div>
            </FooterSection>
          </div>
        </div>

        <div className="mt-10  border-t border-gray-200">
          <div className="flex flex-col py-5 md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <FooterLink href={`/${lang.lang}/terms-and-conditions`}>
                {lang.terms_and_conditions || 'Terms & Conditions'}
              </FooterLink>
              <span className="text-gray-400">|</span>
              <FooterLink href={`/${lang.lang}/privacy-policy`}>
                {lang.privacy_policy || 'Privacy Policy'}
              </FooterLink>
              <span className="text-gray-400">|</span>
              <FooterLink href={`/${lang.lang}/return-policy`}>
                {lang.return_policy || 'Return Policy'}
              </FooterLink>
            </div>
            <p className="text-sm text-gray-600">
              {`${lang.copyright_papercut_factory} ${currentYear} ${lang.all_rights_reserved}` ||
                `Copyright Papercut Factory ${currentYear}. All Rights Reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterWrapper;
