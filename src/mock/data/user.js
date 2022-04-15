import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    avatar: 'http://imgsrc.baidu.com/forum/pic/item/cba75730e924b899837bf30367061d950b7bf6e2.jpg',
    name: '二营长'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

export { LoginUsers, Users };
