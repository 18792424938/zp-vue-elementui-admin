import Vue from 'vue'
import store from '@/store'
import {ADDMENUROUTE} from '@/store/mutations-types'
const _import = require('@/router/import-' + process.env.NODE_ENV)


export function createRoute(list,routerList){
  list.forEach(item=>{
    console.log("item-------",item.name)
    if(item.type=='20'||item.type=='30'){
      if(item.routeName&&item.componentUrl&&item.routePath){
        if(!item.componentUrl.startsWith("/")){
          item.componentUrl = "/"+item.componentUrl;
        }

        if(!item.routePath.startsWith("/")){
          item.routePath = "/"+item.routePath;
        }

        try{
          const componentTemp  =  _import('modules'+item.componentUrl);
          const routerTemp = {
            path: item.routePath,
            component: componentTemp,
            name: item.routeName,
            meta: {id: item.id, title: item.name ,isLogin:true}
          };
          routerList.push(routerTemp)
          store.commit(ADDMENUROUTE,{id:item.id,path: item.routePath,name: item.routeName})
        }catch (e) {
          console.log(e);
        }
      }
    }
    if(item.children&&item.children.length){
      createRoute(item.children,routerList);
    }
  })
}



export function defaultRouteHandle(list){
  for (let i = 0; i < list.length; i++) {
    if(list[i].type=='20'){
      return list[i]
    }
    if(list[i].children&&list[i].children.length){
      const result = defaultRouteHandle(list[i].children)
      if(result){
        return result;
      }
    }
  }
  return ;
}



