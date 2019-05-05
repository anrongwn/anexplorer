
var name = 'wangjr', age = 12;
var obj = {
    name: 'wangjian',
    objAge: this.age,
    myFun: function () {
        console.log(this.name + ' year: ' + this.age);
    }
};

obj.objAge;
obj.myFun();

var farv = 'nnnn';
function show() {
    console.log(this.farv);
}

show();

var db = {
    name: 'db',
    age: 111
};

obj.myFun.call(db);
obj.myFun.apply(db);
obj.myFun.bind(db)();

obj.myFun.call(db, 'call-db', 123);
obj.myFun.apply(db, ['apply-db,134']);
obj.myFun.bind(db, 'bind-db', 145);

