// import {X} from 'lucide-react';
// import {
//   Button,
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   Input,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '.';
// import SearchIcon from '../../public/icons/search-icon';
// import {useEffect, useState} from 'react';
// import {debounce, set} from 'lodash';
// import {usePathname, useSearchParams} from 'next/navigation';
// import {useRouter} from 'next-nprogress-bar';

// export default function SearchProduct({
//   search,
//   setSearch,
//   categoryList,
//   lang,
//   params,
// }) {
//   const [searchText, setSearchText] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [searchParam, setSearchParam] = useState(
//     searchParams.get('search') || '',
//   );

//   const [selectedCategory, setSelectedCategory] = useState('');

//   const handleSearch = debounce(value => setSearchText(value), 300);

//   const searchFunc = () => {
//     if (searchParam == '' && selectedCategory == '') {
//       params.delete('search');
//       params.delete('categoryId');
//       router.push(`/${lang?.lang}/search`);
//     } else if (searchParam && selectedCategory == '') {
//       params.delete('categoryId');
//       router.push(`/${lang?.lang}/search?search=${searchParam.toString()}`);
//     } else if (searchParam == '' && selectedCategory) {
//       params.delete('search');
//       router.push(`/${lang?.lang}/search?categoryId=${selectedCategory}`);
//     } else {
//       router.push(
//         `/${
//           lang?.lang
//         }/search?search=${searchParam.toString()}&categoryId=${selectedCategory}`,
//       );
//     }
//   };

//   // useEffect(() => {
//   //   if (!searchParams) return;
//   //   const params = new URLSearchParams(searchParams);
//   //   if (searchParam !== '') {
//   //     params.set('search', searchParam);
//   //     // router.push(
//   //     //   `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${
//   //     //     lang?.lang
//   //     //   }/search?search=${searchParam.toString()}`,
//   //     // );
//   //     router.push(
//   //       `/${
//   //         lang?.lang
//   //       }/search?search=${searchParam.toString()}&categoryId=${selectedCategory}`,
//   //     );
//   //   } else {
//   //     params.delete('search');
//   //   }
//   // }, [searchParam]);

//   return (
//     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <DialogTrigger>
//         <SearchIcon className="text-background size-5" />
//       </DialogTrigger>
//       <DialogContent
//         aria-describedby={undefined}
//         className="w-fit rounded-md [&>button]:hidden">
//         <DialogHeader className="hidden">
//           <DialogTitle className="hidden"></DialogTitle>
//         </DialogHeader>

//         <div className="flex flex-col md:flex-row gap-4">
//           <Input
//             defaultValue={searchText}
//             onChange={e => handleSearch(e.target.value)}
//             type="text"
//             className="w-full"
//           />
//           <Select onValueChange={value => setSelectedCategory(value)}>
//             <SelectTrigger className="w-56">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               {categoryList?.map(category => {
//                 return (
//                   <SelectItem key={category.id} value={category.id}>
//                     {category.name}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>
//           <Button
//             variant="secondary"
//             className="hover:bg-secondary"
//             onClick={() => {
//               setIsDialogOpen(false);
//               setSearchParam(searchText);
//               setSearchText('');
//               searchFunc();
//             }}>
//             {lang.search || 'Search'}
//           </Button>
//           <DialogClose className="hidden md:block">
//             <Button
//               variant="link"
//               onClick={() => {
//                 setIsDialogOpen(false);
//                 setSearchText('');
//               }}>
//               <X className="size-5 text-black" />
//             </Button>
//           </DialogClose>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import {X} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '.';
import SearchIcon from '../../public/icons/search-icon';
import {useEffect, useState} from 'react';
import {debounce} from 'lodash';
import {usePathname, useSearchParams} from 'next/navigation';
import {useRouter} from 'next-nprogress-bar';

export default function SearchProduct({categoryList, lang, params}) {
  const [searchText, setSearchText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = debounce(value => {
    setSearchText(value);
  }, 0);

  const handleSearch = () => {
    const updatedParams = new URLSearchParams();

    if (searchText) updatedParams.set('search', searchText);

    if (selectedCategory && selectedCategory !== 'all') {
      updatedParams.set('categoryId', selectedCategory);
      setSearchText('');
    } else if (selectedCategory === 'all') {
      setSearchText('');
      updatedParams.delete('categoryId');
    }

    const query = updatedParams.toString();
    router.push(`/${lang?.lang}/search${query ? `?${query}` : ''}`);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <SearchIcon className="text-background size-5" />
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-fit rounded-md [&>button]:hidden">
        <DialogHeader className="hidden">
          <DialogTitle className="hidden"></DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <Input
            value={searchText}
            onChange={e => handleSearchChange(e.target.value)}
            type="text"
            placeholder="Search..."
            className="w-full"
          />

          {/* Category Select */}
          <Select
            value={selectedCategory}
            onValueChange={value => setSelectedCategory(value)}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryList?.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button
            variant="secondary"
            className="hover:bg-secondary"
            onClick={() => {
              setIsDialogOpen(false);
              handleSearch();
            }}>
            {lang?.search || 'Search'}
          </Button>

          {/* Close Button */}
          <DialogClose className="hidden md:block">
            <Button
              variant="link"
              onClick={() => {
                setIsDialogOpen(false);
                setSearchText('');
                setSelectedCategory('');
              }}>
              <X className="size-5 text-black" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
