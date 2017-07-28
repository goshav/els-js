import * as ElsJs from "./index";

ElsJs.Extend(ElsJs);

const ElsObject = ElsJs.ElsJs();

if( ElsJs.Tools.IsBrowser() ) window.ElsJs = ElsObject;
else if( ElsJs.Tools.IsNode() ) global.ElsJs = ElsObject;

export default ElsObject;