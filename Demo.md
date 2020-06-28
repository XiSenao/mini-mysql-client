### Use
```mysql
Grammer: 
use [databaseName]

Analysis results:
Body [formdata]:
database

Example:
use mine;
```

-------------------------------------------------------------------------------------------------------

### Show
```mysql
Grammer:
show tables;
show databases;			

Body [formdata]:
database: [name]
```

-------------------------------------------------------------------------------------------------------

### Create
```mysql
Grammar:
create database [databaseName];

Analysis results:
Body [formdata]:
databasename: [Name]

Example:
create database helloworld;

----------------------------------------------------------------

Grammer:
create table [tableName] (
   		[columnName] (varchar(num) | int(num)) (primary key | not null),
		……)

Analysis results:
Body [Json]:
{
	"method": "create_table",
	"rowParameter":[
		{"arrLimit":"(primary key | not null)","key":[columnName],"limitNum":[number],"limitStyle":"(varchar | int)"}
		……
	],
	"table": [tableName]
}	

Examples:
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
Grammer:
drop database [databaseName]

Analysis results:
Body [formdata]:
databasename: [Name] 

Examples:
drop database minx;

drop table t1;
```
-------------------------------------------------------------------------------------------------------

### Insert
```mysql
Grammer:
insert into [tableName] ([columnName1], [columnName2]…)? value(s)? (v1, v2…), (v3, v4…)…

Analysis results:
Body [Json]:
{
	"method": "insert_into",
	"table": [tableName],
	"limitBody":[column1, column2 …],
	"values":[
		[column1.v1, column1.v2 …],
		[column2.v1, column2.v2 …],
		……
	]
}


Examples:
insert into t1 values ("ashen", 20, "man"), ("jane", 21, "women"), ("mike", 20, "women");

insert into pet ('name','age','master') values('狗',12,'ashen'),('猫',11,'ashen'),('猪',10,'ashen');
```

-------------------------------------------------------------------------------------------------------

### Delete 
```mysql
Grammer:
delete [tableName]… from [tableName] (as [alias])? … where 条件1 ( and | or | ( | )) 条件2 … 

Analysis results:
Body [formdata]:
deleteTable: [tableName...]
table: [{ [tablename], [alias]}...]
formula:{ "arrRes":[{"key":[former_condition],"value":[later_condition],"operator":[(=|<|>)] ,"uid":[unique_number] }…],"pointStr":[suffix_expression]}


Examples:
delete t1, t2 from t1, t2 where t1.name = "ashen" and t2.name = "jane";

delete t1 from t1 where name = "jane" and age = 21;

delete p from pet as p,person as ps where master=ps.name and (p.age=22 or p.age=11);

delete p,ps from pet as p,person as ps where master=ps.name; 
```

-------------------------------------------------------------------------------------------------------

### Update
```mysql
Grammer:
update [tableName] (as [alias])? … set 字段1 = v1 … where 条件1( and | or | ( | ) )条件2 …

Analysis results:
Body [formdata]:
updateItem: [{"key": [former_condition], " value": [later_condition]}, ……]
     table:   [{"tablename": [former_condition], "alias": [later_condition]}……]
formula:{"arrRes":[{"key":[former_condition],"value":[later_condition],"operator":[(=|<|>)] ,"uid":[unique_number]}…],"pointStr":[suffix_expression]}

Examples:
update t1 set name = "nicy" and  age = 21 where gender = "women";

update t1 as a1, t2 as a2 set a1.name = "one", a2.name = "two" where a1.age = 21 and a2.gender = "women";

update  pet as p,person as ps set p.name='猫' where p.age=12 and master=person.name; 

update  pet as p,person as ps set p.name='大白',age=22 where p.age=12 and master=person.name; 
```

-------------------------------------------------------------------------------------------------------

### select
```mysql
Grammer: 
select (* | ([alias].)?[columnName] (as [alias])?...) from [tableName] (as [alias])... where 条件1( and | or | ( | ) )条件2 …

Analysis results:
Body [formdata]:
table: [{"key": [former_condition], " value": [later_condition]}, ……]
formula: {"arrRes":[{"key":[former_condition],"value":[later_condition],"operator":[(=|<|>)] ,"uid":[unique_number]}…],"pointStr":[suffix_expression]}
resultColumns: [(* | {"tablename": [former_condition], "alias": [later_condition]})]

Examples:
select * from t1;

select a1.name, a2.name from t1 as a1, t2 as a2 where a1.name = a2.name and a1.age = a2.age

select a1.name as nnnn, a2.name as plklk from t1 as a1, t2 as a2 where a1.name = a2.name and a1.age = a2.age

select  person.name as 姓名,ps.age as 年龄,p.name as 宠物姓名,p.age from   pet as p,person as ps  where  master=person.name; 
```
-------------------------------------------------------------------------------------------------------

### Grant
```mysql
Grammar:
grant (select | update | insert | drop | *) 
on { database.(*, table1, table2...)… }
to username… (with grant option)

Analysis results:
Body [Json]:
{
	"option": [],
	"tables":[
		{ "database":[databaseName],"table":[("*" | [tableName])] },
		……
	],
	"users":[]
}

Example:
grant  select, update, insert, drop
on mine.(t1)
to test2 with grant option
```