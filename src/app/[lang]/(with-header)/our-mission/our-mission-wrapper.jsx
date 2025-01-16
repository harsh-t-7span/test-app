'use client';

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {clearMessage, getMission} from '@/lib/slices/cmsSlice';
import {CmsPlaceholder} from '@/components/SkeletonPlaceholder/skeletonPlaceholder';

const OurMissionWrapper = () => {
  const dispatch = useDispatch();
  const {mission, isLoading, isError, message} = useSelector(
    state => state.cmsData,
  );

  useEffect(() => {
    dispatch(getMission());
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
          {!isLoading && !isError && typeof mission == 'string' && (
            <div
              dangerouslySetInnerHTML={{
                __html: mission,
              }}></div>
          )}
        </div>
      </section>
    </>
  );
};

export default OurMissionWrapper;
