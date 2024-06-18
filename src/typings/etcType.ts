export type imageurl = {
  imageurl: string[];
};
export type SeriesArray = {
  imageurl: string;
  wadourl : string[];
  gsps : any[]
  gspsBool : boolean;
  wadonumber: number;
  type:string;
  oneSeries : string;
  imageLength:number;
  onDataLoaded : any;
  onComparisonDataLoaded : any;
};
export type dicomHeaderInfo = {
  dicomInfo: {} | null;
};

export type wado = {
  series: string[];
  oneSeries: string[];
};
export type contextMenuLocation = {
  x: string | null;
  y: string | null;
};

export type imageURLIndex = {
  imageURLIndex: string;
  ThunmnailNumber: number;
};

export type ModifyUser = {
  user: string[];
};

export type seriesStorage = {
  default :number[],
  comparison:number[]
}
export type  toolbar = {
  imageurl : string[];
  toolSetting : any
}

export type keyboardControll = {
  wadouri :{
    series:string[],
    oneSeries: string[]
  },
  comparisonWadoURI :{
    series:string[],
    oneSeries: string[]
  },
  imageLayoutBool:boolean,
  comparisonImageLayoutBool : boolean,
  imageLayoutState : {
    imageurl : string
  },
  comparisonImageLayoutState : {
    imageurl : string
  },
}


export type wheelControll = {
  wadouri :{
    series:string[],
    oneSeries: string[]
  },  
  comparisonWadoURI :{
    series:string[],
    oneSeries: string[]
  },
  imageLayoutBool : boolean,
  comparisonImageLayoutBool : boolean,
  imageLayoutState : {
    imageurl : string
  },
  comparisonImageLayoutState : {
    imageurl : string
  },
}

export type toolControll = {
  wadouri :{
    series:string[],
    oneSeries: string[]
  },
  comparisonWadoURI :{
    series:string[],
    oneSeries: string[]
  },
  imageLayoutElementBorderActive :HTMLDivElement | null,
  firstRandering : boolean,
}

export type doubleClickControll = {
  firstRandering : boolean,
  wadouri :{
    series:string[],
    oneSeries: string[]
  },  
  comparisonWadoURI :{
    series:string[],
    oneSeries: string[]
  },
}