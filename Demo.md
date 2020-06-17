### Use
```mysql
use mine;
```

-------------------------------------------------------------------------------------------------------

### Show
```mysql
show tables;

show databases;			
```

-------------------------------------------------------------------------------------------------------

### Create
```mysql
create database helloworld;

create    table    
			   t1 (
				       name varchar ( 30    )  primary key,
			     age int ( 20 )  ,
			         gender  varchar(5) 
			)    ;
			
create table pet( name varchar(30) primary key,
                  age int(20),
                master varchar(5));
```

-------------------------------------------------------------------------------------------------------

### Drop
```mysql
drop database minx;

drop table t1;
```
-------------------------------------------------------------------------------------------------------

### Insert
```mysql
insert into t1 values ("ashen", 20, "man"), ("jane", 21, "women"), ("mike", 20, "women");

insert into pet ('name','age','master') values('狗',12,'ashen'),('猫',11,'ashen'),('猪',10,'ashen');
```

-------------------------------------------------------------------------------------------------------

### Delete 
```mysql
delete t1, t2 from t1, t2 where t1.name = "ashen" and t2.name = "jane";

delete t1 from t1 where name = "jane" and age = 21;

delete p from pet as p,person as ps where master=ps.name and (p.age=22 or p.age=11);

delete p,ps from pet as p,person as ps where master=ps.name; 
```

-------------------------------------------------------------------------------------------------------

### Update
```mysql
update t1 set name = "nicy" and  age = 21 where gender = "women";

update t1 as a1, t2 as a2 set a1.name = "one", a2.name = "two" where a1.age = 21 and a2.gender = "women";

update  pet as p,person as ps set p.name='猫' where p.age=12 and master=person.name; 

update  pet as p,person as ps set p.name='大白',age=22 where p.age=12 and master=person.name; 
```

-------------------------------------------------------------------------------------------------------

### select
```mysql
select * from t1;

select a1.name, a2.name from t1 as a1, t2 as a2 where a1.name = a2.name and a1.age = a2.age

select a1.name as nnnn, a2.name as plklk from t1 as a1, t2 as a2 where a1.name = a2.name and a1.age = a2.age

select  person.name as 姓名,ps.age as 年龄,p.name as 宠物姓名,p.age from   pet as p,person as ps  where  master=person.name; 
```
-------------------------------------------------------------------------------------------------------

### Grant
```mysql
grant  select, update, insert, drop
on mine.(t1)
to test2 with grant option
```