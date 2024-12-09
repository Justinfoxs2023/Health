declare module '*.json' {
  const value: {
    IcoMoonType: string;
    icons: Array<{
      icon: {
        paths: string[];
        attrs: any[];
        isMulticolor: boolean;
        isMulticolor2: boolean;
        grid: number;
        tags: string[];
      };
      attrs: any[];
      properties: {
        order: number;
        id: number;
        name: string;
        prevSize: number;
        code: number;
      };
      setIdx: number;
      setId: number;
      iconIdx: number;
    }>;
    height: number;
    metadata: {
      name: string;
      author?: string;
      license?: string;
    };
    preferences: {
      showGlyphs: boolean;
      showQuickUse: boolean;
      showQuickUse2: boolean;
      showSVGs: boolean;
      fontPref: {
        prefix: string;
        metadata: {
          fontFamily: string;
          fontWeight: string;
        };
        metrics: {
          emSize: number;
          baseline: number;
          whitespace: number;
        };
        embed: boolean;
      };
      imagePref: {
        prefix: string;
        png: boolean;
        useClassSelector: boolean;
        color: number;
        bgColor: number;
        classSelector: string;
      };
      historySize: number;
      showCodes: boolean;
      gridSize: number;
    };
  };
  export default value;
} 