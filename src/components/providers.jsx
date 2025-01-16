'use client';

import React from 'react';
import {Provider} from 'react-redux';
import {store} from '@/lib/store';

export function Providers({children}) {
  return <Provider store={store}>{children}</Provider>;
}
