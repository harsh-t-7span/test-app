'use client';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CmsPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import {getPrivacyPolicy} from '@/lib/slices/cmsSlice';

const PrivacyWrapper = () => {
  const dispatch = useDispatch();
  const {privacyPolicy, isLoading, isError, message} = useSelector(
    state => state.cmsData,
  );

  useEffect(() => {
    dispatch(getPrivacyPolicy());
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
          {!isLoading && !isError && typeof privacyPolicy == 'string' && (
            <div
              dangerouslySetInnerHTML={{
                __html: privacyPolicy,
              }}></div>
          )}
        </div>
      </section>
    </>
  );
};

export default React.memo(PrivacyWrapper);
