import useEmbeddable, {
  IEmbeddableOutput,
} from "components/hooks/useEmbeddable";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
type IZThemeProvider = {
  children: React.ReactNode;
};

interface IEmbeddableData {
  isEmbeddable: boolean;
}

const ZThemeProvider = (props: IZThemeProvider) => {
  const isEmbeddable:IEmbeddableOutput = useEmbeddable();
  const [embeddableData] = useState<IEmbeddableOutput>(isEmbeddable);
  return (
    <ThemeProvider theme={embeddableData as IEmbeddableData}>
      {props.children}
    </ThemeProvider>
  );
};

export default ZThemeProvider;