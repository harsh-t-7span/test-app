import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ReactStars from 'react-stars';
import {addReviewProduct} from '@/lib/slices/productSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Spinner} from '@/asset/icons/spinner';

export function RatingModal({open, onOpenChange, productId, lang}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="p-8">
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {lang.rating} & {lang.reviews}
          </DialogTitle>
        </DialogHeader>
        <RatingForm
          lang={lang}
          productId={productId}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

const RatingForm = ({lang, productId, onOpenChange}) => {
  const dispatch = useDispatch();

  const {isLoadingAddReviewProduct} = useSelector(state => state.productData);

  const {customer} = useSelector(state => state.customerData);

  const formik = useFormik({
    initialValues: {
      title: '',
      detail: '',
      valueRating: 0,
      qualityRating: 0,
      priceRating: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(
        lang.title_is_required || 'Title is required',
      ),
      detail: Yup.string().required(
        lang.comment_is_required || 'Comment is required',
      ),
      valueRating: Yup.number().min(
        1,
        lang.value_rating_is_required || 'Value rating is required',
      ),
      qualityRating: Yup.number().min(
        1,
        lang.quality_rating_is_required || 'Quality rating is required',
      ),
      priceRating: Yup.number().min(
        1,
        lang.price_rating_is_required || 'Price rating is required',
      ),
    }),
    onSubmit: values => {
      const data = {
        review: {
          title: values.title,
          detail: values.detail,
          nickname: customer?.firstname + ' ' + customer?.lastname,
          ratings: [
            {
              rating_name: 'Value',
              value: values.valueRating,
            },
            {
              rating_name: 'Quality',
              value: values.qualityRating,
            },
            {
              rating_name: 'Price',
              value: values.priceRating,
            },
          ],
          review_entity: 'product',
          customer_id: customer?.customer_id,
          review_status: 2,
          entity_pk_value: productId,
        },
      };

      dispatch(addReviewProduct(data))
        .unwrap()
        .then(data => {})
        .catch(error => {
          console.error('Review Product failed:', error);
        });
      onOpenChange(false);
    },
  });

  const handleRatingChange = name => newRating => {
    formik.setFieldValue(name, newRating);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Input
          name="title"
          placeholder="Enter title"
          value={formik.values.title}
          onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
        )}
      </div>
      <div>
        <Textarea
          name="detail"
          placeholder="Enter your comment here"
          className="min-h-[100px] !outline-0 !ring-0"
          onChange={formik.handleChange}
          value={formik.values.detail}
          onBlur={formik.handleBlur}
        />
        {formik.touched.detail && formik.errors.detail && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.detail}</p>
        )}
      </div>
      {['value', 'quality', 'price'].map(type => (
        <div key={type}>
          <div className="flex items-center gap-4">
            <span className="min-w-16 capitalize">{type}</span>
            <ReactStars
              count={5}
              onChange={handleRatingChange(`${type}Rating`)}
              size={24}
              color2="#ffd700"
              color1="#e7e7e7"
              value={formik.values[`${type}Rating`]}
            />
          </div>
          {formik.touched[`${type}Rating`] &&
            formik.errors[`${type}Rating`] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[`${type}Rating`]}
              </div>
            )}
        </div>
      ))}
      <div className="flex justify-center">
        <Button
          disabled={isLoadingAddReviewProduct}
          variant="outline"
          type="submit"
          className="min-w-[100px] ">
          {isLoadingAddReviewProduct ? (
            <Spinner animation="border" size="sm" />
          ) : (
            lang.submit || 'Submit'
          )}
        </Button>
      </div>
    </form>
  );
};

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {Button} from '@/components/ui/button';
// import {Input} from '@/components/ui/input';
// import {Textarea} from '@/components/ui/textarea';
// import {useFormik} from 'formik';
// import * as Yup from 'yup';
// import ReactStars from 'react-stars';
// import {addReviewProduct} from '@/lib/slices/productSlice';
// import {useDispatch, useSelector} from 'react-redux';
// import {Spinner} from '@/asset/icons/spinner';

// export function RatingModal({open, onOpenChange, productId}) {
//   const dispatch = useDispatch();

//   const {isLoadingAddReviewProduct} = useSelector(state => state.productData);

//   const {customer} = useSelector(state => state.customerData);

//   const formik = useFormik({
//     initialValues: {
//       title: '',
//       detail: '',
//       valueRating: 0,
//       qualityRating: 0,
//       priceRating: 0,
//     },
//     validationSchema: Yup.object({
//       title: Yup.string().required('Title is required'),
//       detail: Yup.string().required('Comment is required'),
//       valueRating: Yup.number().min(1, 'Value rating is required'),
//       qualityRating: Yup.number().min(1, 'Quality rating is required'),
//       priceRating: Yup.number().min(1, 'Price rating is required'),
//     }),
//     onSubmit: values => {
//       const data = {
//         review: {
//           title: values.title,
//           detail: values.detail,
//           nickname: customer?.firstname + ' ' + customer?.lastname,
//           ratings: [
//             {
//               rating_name: 'Value',
//               value: values.valueRating,
//             },
//             {
//               rating_name: 'Quality',
//               value: values.qualityRating,
//             },
//             {
//               rating_name: 'Price',
//               value: values.priceRating,
//             },
//           ],
//           review_entity: 'product',
//           customer_id: customer?.customer_id,
//           review_status: 2,
//           entity_pk_value: productId,
//         },
//       };

//       dispatch(addReviewProduct(data))
//         .unwrap()
//         .then(data => {
//           if (data) {
//           }
//         })
//         .catch(error => {
//           console.error('Review Product failed:', error);
//         });
//       onOpenChange(false);
//     },
//   });

//   const handleRatingChange = name => newRating => {
//     formik.setFieldValue(name, newRating);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange} className="p-8">
//       <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-2xl">Rating & Reviews</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           <div>
//             <Input
//               placeholder="Enter title"
//               {...formik.getFieldProps('title')}
//               onChange={formik.handleChange}
//               value={formik.values.title}
//             />
//             {formik.touched.title && formik.errors.title && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.title}
//               </div>
//             )}
//           </div>
//           <div>
//             <Textarea
//               placeholder="Enter your comment here"
//               className="min-h-[100px]"
//               {...formik.getFieldProps('detail')}
//               onChange={formik.handleChange}
//               value={formik.values.detail}
//             />
//             {formik.touched.detail && formik.errors.detail && (
//               <div className="text-red-500 text-sm mt-1">
//                 {formik.errors.detail}
//               </div>
//             )}
//           </div>
//           {['value', 'quality', 'price'].map(type => (
//             <div key={type}>
//               <div className="flex items-center gap-4">
//                 <span className="min-w-16 capitalize">{type}</span>
//                 <ReactStars
//                   count={5}
//                   onChange={handleRatingChange(`${type}Rating`)}
//                   size={24}
//                   color2="#ffd700"
//                   color1="#e7e7e7"
//                   value={formik.values[`${type}Rating`]}
//                 />
//               </div>
//               {formik.touched[`${type}Rating`] &&
//               formik.errors[`${type}Rating`] ? (
//                 <div className="text-red-500 text-sm mt-1">
//                   {formik.errors[`${type}Rating`]}
//                 </div>
//               ) : null}
//             </div>
//           ))}
//           <div className="flex justify-center">
//             <Button
//               disabled={isLoadingAddReviewProduct}
//               variant="outline"
//               type="submit"
//               className="min-w-[100px] ">
//               {isLoadingAddReviewProduct ? (
//                 <Spinner animation="border" size="sm" />
//               ) : (
//                 'Submit'
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
