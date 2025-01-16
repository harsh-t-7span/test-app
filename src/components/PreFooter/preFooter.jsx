'use client';
import React from 'react';
import {Clock} from 'lucide-react';
import {Button} from '@/components/ui/button';

const PreFooter = ({lang}) => {
  const handleClick = () => {
    window.open('https://wa.me/+97474749722', '_blank');
  };

  return (
    <div className="bg-primary md:bg-[url('../../asset/lshade.png')] bg-no-repeat bg-left ">
      <div className="md:bg-[url('../../asset/rshade.png')] bg-no-repeat  bg-right py-5 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white text-sm md:text-base font-medium">
                {lang?.t_24_7_online_support}
              </span>
            </div>

            <p className="text-white text-sm md:text-base">
              {lang?.discount_code_text}
            </p>

            <Button
              variant="secondary"
              onClick={handleClick}
              className="hover:bg-background hover:text-foreground transition-colors">
              {lang?.talk_with_us}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreFooter;
