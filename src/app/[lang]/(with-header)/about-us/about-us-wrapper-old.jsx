'use client';

import React, {useEffect} from 'react';
import PreFooter from '@/components/PreFooter/preFooter';
import {useDispatch, useSelector} from 'react-redux';
import {getAboutus} from '@/lib/slices/cmsSlice';
import {CmsPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';

const AboutUsWrapperOld = ({lang}) => {
  const dispatch = useDispatch();
  const {about, isLoading, isError, message} = useSelector(
    state => state.cmsData,
  );

  useEffect(() => {
    dispatch(getAboutus());
  }, [dispatch]);

  return (
    <>
      <section className="bg-primary-gradient">
        <div className="container min-h-[620px]">
          {isLoading && (
            <div className="py-4">
              {Array.from({length: 3}, (_, index) => (
                <CmsPlaceholder key={index} />
              ))}
            </div>
          )}
          {isError && <div className="error-message">{message}</div>}
          {!isLoading && !isError && typeof about == 'string' && (
            <div
              dangerouslySetInnerHTML={{
                __html: about,
              }}></div>
          )}
        </div>
      </section>
      <PreFooter lang={lang} />
    </>
  );
};

export default AboutUsWrapperOld;
