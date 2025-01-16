'use client';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {clearMessage, getVision} from '@/lib/slices/cmsSlice';
import {CmsPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';

const OurVisionWrapper = () => {
  const dispatch = useDispatch();
  const {vision, isLoading, isError, message} = useSelector(
    state => state.cmsData,
  );

  useEffect(() => {
    dispatch(getVision());
    dispatch(clearMessage());
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
          {!isLoading && !isError && typeof vision == 'string' && (
            <div
              dangerouslySetInnerHTML={{
                __html: vision,
              }}></div>
          )}
        </div>
      </section>
    </>
  );
};

export default OurVisionWrapper;
