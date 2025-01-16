'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Check, ChevronDown} from 'lucide-react';
import {useRouter} from 'next-nprogress-bar';
import Image from 'next/image';
import {useParams, usePathname} from 'next/navigation';
import {useState} from 'react';
import uaeImg from '../../public/images/ar.png';
import usImg from '../../public/images/en.png';
import {Languages} from '../lib/constants';

export default function LangSelector({lang}) {
  const language = useParams();

  const pathName = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(
    () => Languages.find(item => item.value === language.lang).value,
  );
  const handleChange = event => {
    let path = pathName.split('/');
    path[1] = event;
    path = path.join('/');
    router.push(path);
  };

  const imageMap = {
    en: usImg,
    ar: uaeImg,
  };
  return (
    <div className="flex items-center rounded-md ">
      <DropdownMenu className="w-full">
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2  text-background cursor-pointer text-sm lg:text-base">
            <Image width={20} height={20} src={imageMap[value]} alt={value} />
            <div className="flex items-center gap-1">
              <span>{value === 'en' ? lang.english : lang.arabic}</span>
              <ChevronDown className="h-4 w-4 text-background" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background">
          {Languages?.map(language => (
            <DropdownMenuItem
              key={language.value}
              onSelect={() => handleChange(language.value)}
              className="flex items-center gap-2 text-foreground">
              {/* <Image
                width={20}
                height={20}
                src={imageMap[language.value]}
                alt={language.value}
              /> */}
              {language.description}
              {language.value === value && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
