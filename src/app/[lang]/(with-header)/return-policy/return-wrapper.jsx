'use client';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CmsPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';
import {getRefundPolicy} from '@/lib/slices/cmsSlice';

const ReturnWrapper = () => {
  const dispatch = useDispatch();
  const {refundPolicy, isLoading, isError, message} = useSelector(
    state => state.cmsData,
  );

  useEffect(() => {
    dispatch(getRefundPolicy());
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
          {!isLoading && !isError && typeof refundPolicy == 'string' && (
            <div
              dangerouslySetInnerHTML={{
                __html: refundPolicy,
              }}></div>
          )}
        </div>
      </section>
    </>
  );
};

export default React.memo(ReturnWrapper);
