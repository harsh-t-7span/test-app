'use client';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getFAQs} from '@/lib/slices/cmsSlice';
import {CmsPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';

const FAQWrapper = () => {
  const dispatch = useDispatch();
  const {faqs, isLoading, isError, message} = useSelector(
    state => state.cmsData,
  );

  useEffect(() => {
    dispatch(getFAQs());
  }, [dispatch]);

  useEffect(() => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    function toggleAccordion(event) {
      const trigger = event.currentTarget;
      trigger.classList.toggle('active');
      const content = trigger.nextElementSibling;

      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    }

    accordionTriggers.forEach(trigger => {
      trigger.addEventListener('click', toggleAccordion);
    });

    return () => {
      accordionTriggers.forEach(trigger => {
        trigger.removeEventListener('click', toggleAccordion);
      });
    };
  }, [faqs]);

  return (
    <>
      <section className="pt-4 pb-12">
        <div className="container min-h-[620px]">
          {isLoading && (
            <div className="py-4">
              {Array.from({length: 3}, (_, index) => (
                <CmsPlaceholder key={index} />
              ))}
            </div>
          )}
          {isError && <div className="error-message">{message}</div>}
          {!isLoading && !isError && typeof faqs == 'string' && (
            <div className="flex flex-wrap">
              <div className="w-full flex-auto onlyfaq">
                <div
                  dangerouslySetInnerHTML={{
                    __html: faqs,
                  }}></div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default React.memo(FAQWrapper);
