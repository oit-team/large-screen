const goodsJson = [
  {"id":1,"title":"苹果","price":2.2},
  {"id":2,"title":"香蕉","price":3.2},
  {"id":3,"title":"橘子","price":1.4},
  {"id":4,"title":"芒果","price":5.6},
  {"id":5,"title":"梨子","price":3.3},
  {"id":6,"title":"葡萄","price":3.6}
]

const addrList = [
  {
    id:1,
    addr:"上海市浦东新区鹏飞路5103弄7号1102"
  },
  {
    id:2,
    addr:"上海市浦东新区高青路2345弄20号101"
  }
]


// const menuList = [
//   {
//     createDate: "2021-02-23",
//     createId: 1,
//     id: 4,
//     menuCode: "20210223001",
//     menuImg: "http://res.oitor.com:8099/upload/0/2020/4/ddcdd9c1907641b39bd57698a293fa16.jpeg",
//     menuName: "菜单管理",
//     menuRemark: "新增菜单2",
//     menuUrl: "/menu/menuList",
//     orderBy: 0,
//     path: "0",
//     type: "0",
//     updateId: 0,
//     updateTime: null,
//     childrenMenu: [
//       {
//         createDate: "2021-02-25",
//         createId: 1,
//         id: 6,
//         menuCode: "20210223001",
//         menuImg: "http://res.oitor.com:8099/upload/0/2020/4/ddcdd9c1907641b39bd57698a293fa16.jpeg",
//         menuName: "菜单列表",
//         menuRemark: "新增菜单",
//         menuUrl: "/menu/menuList",
//         orderBy: 0,
//         path: "4,",
//         type: "0",
//         updateId: 0,
//         updateTime: null
//       }
//     ]
//   },
//   {
//     createDate: "2021-02-23",
//     createId: 1,
//     id: 5,
//     menuCode: "20210223001",
//     menuImg: "http://res.oitor.com:8099/upload/0/2020/4/ddcdd9c1907641b39bd57698a293fa16.jpeg",
//     menuName: "菜单管理",
//     menuRemark: "新增菜单2",
//     menuUrl: "/menu/menuList",
//     orderBy: 0,
//     path: "0",
//     type: "0",
//     updateId: 0,
//     updateTime: null,
//     childrenMenu: [
//       {
//         createDate: "2021-02-25",
//         createId: 1,
//         id: 7,
//         menuCode: "20210223001",
//         menuImg: "http://res.oitor.com:8099/upload/0/2020/4/ddcdd9c1907641b39bd57698a293fa16.jpeg",
//         menuName: "角色列表",
//         menuRemark: "新增菜单",
//         menuUrl: "/role/roleList",
//         orderBy: 0,
//         path: "4,",
//         type: "0",
//         updateId: 0,
//         updateTime: null
//       }
//     ]
//   }
// ]

const homeMenuList = [
  {
    menuId:"1",
    menuName:"投诉管理",
    menuCode:"complain",
    menuIcon:"",
    subMenuList:[
      {
        menuId:'1-1',
        menuName:"投诉列表",
        menuCode:"complainList",
        menuIcon:"",
        menuUrl:"/complain/complainList",
      },
      {
        menuId:'1-2',
        menuName:"投诉报表",
        menuCode:"complainList",
        menuIcon:"",
        menuUrl:"/complain/complainForm",
      }
    ]
  },
  {
    menuId:"2",
    menuName:"日志管理",
    menuCode:"log",
    menuIcon:"",
    subMenuList:[
      {
        menuId:'2-1',
        menuName:"操作日志",
        menuCode:"opeList",
        menuIcon:"",
        menuUrl:"/log/opeLog",
      },
      {
        menuId:'2-2',
        menuName:"设备日志",
        menuCode:"devList",
        menuIcon:"",
        menuUrl:"/log/devLog",
      }
    ]
  },
  {
    menuId:"3",
    menuName:"菜单管理",
    menuCode:"menu",
    menuIcon:"",
    subMenuList:[
      {
        menuId:'3-1',
        menuName:"菜单列表",
        menuCode:"menuList",
        menuIcon:"",
        menuUrl:"/menu/menuList",
      }
    ]
  },
  {
    menuId:"4",
    menuName:"角色管理",
    menuCode:"role",
    menuIcon:"",
    subMenuList:[
      {
        menuId:'4-1',
        menuName:"角色列表",
        menuCode:"roleList",
        menuIcon:"",
        menuUrl:"/role/roleList",
      }
    ]
  }
]

const menuList = [
  {
    id: 4,
    menuName: "菜单管理",
    childrenMenu: [
      {
        id: 5,
        menuName: "菜单列表",
        menuRemark: "新增菜单",
        menuUrl: "/menu/menuList",
      }
    ]
  },
  {
    id: 6,
    menuName: "菜单管理",
    childrenMenu: [
      {
        id: 7,
        menuName: "角色列表",
        menuRemark: "新增菜单",
        menuUrl: "/role/roleList",
      }
    ]
  }
]



export default  {
  goodsJson,
  addrList,
  homeMenuList,
  menuList
}