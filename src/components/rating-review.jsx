import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {reviewLike, reviewUnlike} from '@/lib/slices/productSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/navigation';
import moment from 'moment';
import {ReviewPlaceholder} from './SkeletonPlaceholder/skeletonPlaceholder';
import {Button} from '.';
import {MoveRightIcon} from 'lucide-react';
import {RatingModal} from './rating-modal';
import ReactStars from 'react-stars';
import {letterColors} from '@/lib/constants';
import {getProductDetailsById} from '@/lib/slices/productSlice';

const RatingReview = ({lang}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {customer, isLoggedIn} = useSelector(state => state.customerData);
  const {isLoadingProductDetailsById} = useSelector(state => state.productData);
  const {productDetails} = useSelector(state => state.productData);
  const reviewData = productDetails?.product_reviews;
  const productId = productDetails?.id;
  const [showModal, setShowModal] = useState(false);
  const [initialReviewCount, setInitialReviewCount] = useState(3);
  const {isLoadingAddReviewProduct} = useSelector(state => state.productData);

  const ReadMore = ({text}) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };

    return (
      <p className="mb-3 text-sm text-zinc-600">
        {isReadMore ? text.slice(0, 400) : text}
        {text.length > 400 && (
          <span
            onClick={toggleReadMore}
            className="text-blue-400 text-sm font-semibold cursor-pointer">
            {isReadMore
              ? `...${lang.more || 'More'}`
              : `...${lang.less || 'Less'}`}
          </span>
        )}
      </p>
    );
  };

  const LocalStarComponent = ({item}) => {
    const totalStars =
      item?.rating?.reduce((sum, stars) => sum + Number(stars.value), 0) || 0;
    const averageStars = totalStars / 3;

    return (
      <div className="flex items-center gap-1">
        <ReactStars
          count={5}
          size={24}
          value={averageStars}
          color2="#FFD700"
          color1="#e7e7e7"
          edit={false}
        />
        <small>{moment(item.created_at).fromNow()}</small>
      </div>
    );
  };

  const handleLike = item => {
    dispatch(
      reviewLike({
        review_id: item.review_id,
        customer_id: customer.customer_id,
      }),
    );
  };

  const handleUnlike = item => {
    dispatch(
      reviewUnlike({
        review_id: item.review_id,
        customer_id: customer.customer_id,
      }),
    );
  };

  // useEffect(() => {
  //   dispatch(getProductDetailsById(productId));
  // }, [isLoadingAddReviewProduct, dispatch]);

  return (
    <section className="mt-8 md:mt-16">
      <div className="container px-4 md:px-6">
        <div>
          {isLoadingProductDetailsById ? (
            <ReviewPlaceholder />
          ) : (
            <>
              <div className="py-10 border-t ">
                <div className="flex flex-col sm:flex-row justify-between items-start pb-4 border-b border-gray-300">
                  <div>
                    <h4 className="text-2xl md:text-4xl font-bold mb-2">
                      {lang.rating || 'Ratings'} & {lang.reviews || 'Reviews'}
                    </h4>
                    <p className="text-sm md:text-base text-gray-500">{`${
                      reviewData?.total_approved_rating
                    } ${lang.rating || 'Ratings'} &,
                    ${reviewData?.total_approved_reviews} ${
                      lang.reviews || 'Reviews'
                    }`}</p>
                    <div className="font-extrabold text-yellow-400 text-2xl md:text-3xl mt-3 flex items-center gap-2 md:gap-4">
                      {/* {reviewData?.average_rating.toFixed(1)}{' '} */}
                      <ReactStars
                        count={5}
                        size={30}
                        value={reviewData?.average_rating}
                        color2="#ffd700"
                        color1="#e7e7e7"
                        edit={false}
                      />
                    </div>
                  </div>
                  {customer?.customer_id ? (
                    <Button
                      onClick={() => setShowModal(true)}
                      variant="outline"
                      className="mt-4 sm:mt-0">
                      {lang.rate_product || 'Rate Product'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push('/sign-in')}
                      variant="outline"
                      className="mt-4 sm:mt-0">
                      {lang.rate_product || 'Rate Product'}
                    </Button>
                  )}
                </div>
                {/* <div className="space-y-8 md:space-y-11 h-auto max-h-[500px] md:max-h-[700px] overflow-y-auto"> */}
                <div className="space-y-8 md:space-y-11 h-auto">
                  {reviewData && reviewData?.reviews.length > 0 ? (
                    reviewData?.reviews
                      ?.slice(0, initialReviewCount)
                      ?.map((item, index) => {
                        const firstLetter = item.nickname
                          .trim()
                          .charAt(2)
                          .toUpperCase();
                        const bgColor = letterColors[firstLetter] || '#000';

                        return (
                          <div
                            key={index}
                            className="first:pt-8 md:first:pt-11 last:pb-8 md:last:pb-11">
                            <div className="flex gap-3 md:gap-5 mb-4">
                              <div
                                style={{backgroundColor: bgColor}}
                                className={`rounded-full size-[50px] md:size-[70px] flex justify-center items-center`}>
                                <p className="text-white font-black text-2xl md:text-4xl">
                                  {item.nickname.trim().charAt(0).toUpperCase()}
                                </p>
                                {/* <Image
                                  src={item.profile_photo || nouserImg}
                                  alt={item.nickname || 'User Profile'}
                                  height={70}
                                  width={70}
                                /> */}
                              </div>
                              <div className="">
                                <h5 className="text-lg md:text-xl font-semibold">
                                  {item.nickname}
                                </h5>
                                {/* <p className="text-gray-500">1 Review</p> */}
                                <LocalStarComponent item={item} />
                              </div>
                            </div>
                            <ReadMore text={item.detail} />
                            {isLoggedIn ? (
                              item.like_customer_ids.includes(
                                customer?.customer_id,
                              ) === true ? (
                                <button
                                  onClick={() => handleUnlike(item)}
                                  className="text-neutral-400 font-semibold flex gap-1.5 items-center">
                                  <svg
                                    width="24"
                                    height="21"
                                    viewBox="0 0 24 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="rotate-180">
                                    <path
                                      d="M22.773 7.72138C22.3041 7.18098 21.7245 6.74766 21.0736 6.45073C20.4226 6.15381 19.7155 6.00023 19 6.00038H15.011L15.347 3.95938C15.4659 3.24064 15.3225 2.50311 14.9429 1.88132C14.5633 1.25952 13.9728 0.79489 13.2792 0.572169C12.5856 0.349448 11.835 0.383478 11.1644 0.668053C10.4938 0.952627 9.94777 1.46878 9.626 2.12238L7.712 6.00038H5C3.67441 6.00197 2.40356 6.52926 1.46622 7.4666C0.528882 8.40393 0.00158786 9.67478 0 11.0004L0 16.0004C0.00158786 17.326 0.528882 18.5968 1.46622 19.5342C2.40356 20.4715 3.67441 20.9988 5 21.0004H18.3C19.5035 20.9955 20.6652 20.5587 21.5738 19.7695C22.4824 18.9804 23.0776 17.8913 23.251 16.7004L23.956 11.7004C24.0553 10.9911 24.001 10.2688 23.7969 9.58231C23.5928 8.89582 23.2437 8.2612 22.773 7.72138ZM2 16.0004V11.0004C2 10.2047 2.31607 9.44167 2.87868 8.87906C3.44129 8.31645 4.20435 8.00038 5 8.00038H7V19.0004H5C4.20435 19.0004 3.44129 18.6843 2.87868 18.1217C2.31607 17.5591 2 16.796 2 16.0004ZM21.971 11.4194L21.265 16.4194C21.1618 17.1334 20.8057 17.7866 20.2616 18.2603C19.7175 18.7339 19.0214 18.9965 18.3 19.0004H9V7.73438C9.09424 7.65227 9.17226 7.55323 9.23 7.44238L11.419 3.00738C11.5011 2.85931 11.6171 2.73283 11.7576 2.63834C11.8981 2.54385 12.059 2.48404 12.2271 2.46384C12.3952 2.44363 12.5657 2.4636 12.7246 2.5221C12.8834 2.58061 13.0262 2.67598 13.141 2.80038C13.2392 2.91462 13.3111 3.04915 13.3513 3.19435C13.3916 3.33955 13.3994 3.49184 13.374 3.64038L12.846 6.84038C12.8228 6.98336 12.831 7.12967 12.8699 7.26918C12.9089 7.4087 12.9776 7.53809 13.0715 7.64841C13.1654 7.75872 13.2821 7.84733 13.4136 7.90811C13.545 7.96888 13.6882 8.00036 13.833 8.00038H19C19.4294 8.00032 19.8538 8.09244 20.2445 8.27052C20.6353 8.4486 20.9832 8.70849 21.2649 9.03261C21.5465 9.35674 21.7553 9.73755 21.8772 10.1493C21.999 10.5611 22.031 10.9942 21.971 11.4194Z"
                                      fill="#A0A0A0"
                                    />
                                  </svg>
                                  <p className="mb-1">{lang.unlike}</p>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleLike(item)}
                                  className="text-neutral-400 font-semibold flex gap-1.5 items-center">
                                  <svg
                                    width="24"
                                    height="21"
                                    viewBox="0 0 24 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M22.773 7.72138C22.3041 7.18098 21.7245 6.74766 21.0736 6.45073C20.4226 6.15381 19.7155 6.00023 19 6.00038H15.011L15.347 3.95938C15.4659 3.24064 15.3225 2.50311 14.9429 1.88132C14.5633 1.25952 13.9728 0.79489 13.2792 0.572169C12.5856 0.349448 11.835 0.383478 11.1644 0.668053C10.4938 0.952627 9.94777 1.46878 9.626 2.12238L7.712 6.00038H5C3.67441 6.00197 2.40356 6.52926 1.46622 7.4666C0.528882 8.40393 0.00158786 9.67478 0 11.0004L0 16.0004C0.00158786 17.326 0.528882 18.5968 1.46622 19.5342C2.40356 20.4715 3.67441 20.9988 5 21.0004H18.3C19.5035 20.9955 20.6652 20.5587 21.5738 19.7695C22.4824 18.9804 23.0776 17.8913 23.251 16.7004L23.956 11.7004C24.0553 10.9911 24.001 10.2688 23.7969 9.58231C23.5928 8.89582 23.2437 8.2612 22.773 7.72138ZM2 16.0004V11.0004C2 10.2047 2.31607 9.44167 2.87868 8.87906C3.44129 8.31645 4.20435 8.00038 5 8.00038H7V19.0004H5C4.20435 19.0004 3.44129 18.6843 2.87868 18.1217C2.31607 17.5591 2 16.796 2 16.0004ZM21.971 11.4194L21.265 16.4194C21.1618 17.1334 20.8057 17.7866 20.2616 18.2603C19.7175 18.7339 19.0214 18.9965 18.3 19.0004H9V7.73438C9.09424 7.65227 9.17226 7.55323 9.23 7.44238L11.419 3.00738C11.5011 2.85931 11.6171 2.73283 11.7576 2.63834C11.8981 2.54385 12.059 2.48404 12.2271 2.46384C12.3952 2.44363 12.5657 2.4636 12.7246 2.5221C12.8834 2.58061 13.0262 2.67598 13.141 2.80038C13.2392 2.91462 13.3111 3.04915 13.3513 3.19435C13.3916 3.33955 13.3994 3.49184 13.374 3.64038L12.846 6.84038C12.8228 6.98336 12.831 7.12967 12.8699 7.26918C12.9089 7.4087 12.9776 7.53809 13.0715 7.64841C13.1654 7.75872 13.2821 7.84733 13.4136 7.90811C13.545 7.96888 13.6882 8.00036 13.833 8.00038H19C19.4294 8.00032 19.8538 8.09244 20.2445 8.27052C20.6353 8.4486 20.9832 8.70849 21.2649 9.03261C21.5465 9.35674 21.7553 9.73755 21.8772 10.1493C21.999 10.5611 22.031 10.9942 21.971 11.4194Z"
                                      fill="#A0A0A0"
                                    />
                                  </svg>
                                  <p className="mt-1">{lang.like}</p>
                                </button>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`${lang.lang}/sign-in`)
                                }
                                className="text-neutral-400 font-semibold flex gap-1.5 items-center">
                                <svg
                                  width="24"
                                  height="21"
                                  viewBox="0 0 24 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M22.773 7.72138C22.3041 7.18098 21.7245 6.74766 21.0736 6.45073C20.4226 6.15381 19.7155 6.00023 19 6.00038H15.011L15.347 3.95938C15.4659 3.24064 15.3225 2.50311 14.9429 1.88132C14.5633 1.25952 13.9728 0.79489 13.2792 0.572169C12.5856 0.349448 11.835 0.383478 11.1644 0.668053C10.4938 0.952627 9.94777 1.46878 9.626 2.12238L7.712 6.00038H5C3.67441 6.00197 2.40356 6.52926 1.46622 7.4666C0.528882 8.40393 0.00158786 9.67478 0 11.0004L0 16.0004C0.00158786 17.326 0.528882 18.5968 1.46622 19.5342C2.40356 20.4715 3.67441 20.9988 5 21.0004H18.3C19.5035 20.9955 20.6652 20.5587 21.5738 19.7695C22.4824 18.9804 23.0776 17.8913 23.251 16.7004L23.956 11.7004C24.0553 10.9911 24.001 10.2688 23.7969 9.58231C23.5928 8.89582 23.2437 8.2612 22.773 7.72138ZM2 16.0004V11.0004C2 10.2047 2.31607 9.44167 2.87868 8.87906C3.44129 8.31645 4.20435 8.00038 5 8.00038H7V19.0004H5C4.20435 19.0004 3.44129 18.6843 2.87868 18.1217C2.31607 17.5591 2 16.796 2 16.0004ZM21.971 11.4194L21.265 16.4194C21.1618 17.1334 20.8057 17.7866 20.2616 18.2603C19.7175 18.7339 19.0214 18.9965 18.3 19.0004H9V7.73438C9.09424 7.65227 9.17226 7.55323 9.23 7.44238L11.419 3.00738C11.5011 2.85931 11.6171 2.73283 11.7576 2.63834C11.8981 2.54385 12.059 2.48404 12.2271 2.46384C12.3952 2.44363 12.5657 2.4636 12.7246 2.5221C12.8834 2.58061 13.0262 2.67598 13.141 2.80038C13.2392 2.91462 13.3111 3.04915 13.3513 3.19435C13.3916 3.33955 13.3994 3.49184 13.374 3.64038L12.846 6.84038C12.8228 6.98336 12.831 7.12967 12.8699 7.26918C12.9089 7.4087 12.9776 7.53809 13.0715 7.64841C13.1654 7.75872 13.2821 7.84733 13.4136 7.90811C13.545 7.96888 13.6882 8.00036 13.833 8.00038H19C19.4294 8.00032 19.8538 8.09244 20.2445 8.27052C20.6353 8.4486 20.9832 8.70849 21.2649 9.03261C21.5465 9.35674 21.7553 9.73755 21.8772 10.1493C21.999 10.5611 22.031 10.9942 21.971 11.4194Z"
                                    fill="#A0A0A0"
                                  />
                                </svg>
                                <p className="mt-1">{lang.like}</p>
                              </button>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <p className="py-5">
                      {lang.no_review_found || 'No review found.'}
                    </p>
                  )}
                </div>

                {reviewData?.reviews.length > 3 && (
                  <Button
                    variant="link"
                    className="text-black hover:text-primary hover:no-underline justify-start py-2.5 md:py-3.5 px-0 border-y border-gray-300 text-base md:text-lg w-full rounded-none mb-8"
                    onClick={() => {
                      if (initialReviewCount === reviewData?.reviews.length) {
                        setInitialReviewCount(3);
                      } else {
                        setInitialReviewCount(reviewData?.reviews.length);
                      }
                    }}>
                    {initialReviewCount === reviewData?.reviews.length
                      ? lang.show_less || 'Show Less'
                      : lang.see_other_reviews || 'See Other Reviews'}{' '}
                    <MoveRightIcon
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        initialReviewCount === reviewData?.reviews.length
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <RatingModal
          lang={lang}
          productId={productId}
          open={showModal}
          onOpenChange={setShowModal}
          onPress={() => {
            setShowModal(false);
          }}
        />
      )}
    </section>
  );
};

export default RatingReview;
