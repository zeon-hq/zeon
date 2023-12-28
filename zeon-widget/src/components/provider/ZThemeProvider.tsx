import useEmbeddable from 'components/hooks/useEmbeddable';
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
type IZThemeProvider = {
    children: React.ReactNode;
  };

  interface IEmbeddableData {
    isEmbeddable: boolean;
  }
  
const ZThemeProvider = (props: IZThemeProvider) => {
    const isEmbeddable = useEmbeddable();
    const [embeddableData] = useState<IEmbeddableData>({isEmbeddable});
  return (
    <ThemeProvider theme={embeddableData as IEmbeddableData}>{props.children}</ThemeProvider>
  )
}

export default ZThemeProvider;