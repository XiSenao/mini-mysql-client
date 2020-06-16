## Introducción

  Simple simulation of MySQL database, the front and rear end separation technology, the front end of the Vue technology framework, through the easy-window to convert it into application software, but the essence is still web applications.

## Get Started

Install nodejs **v8.12.0** first.

```bash
npm install

# serve with hot reload at localhost:8080
npm run dev

```

## Características

```
- Permisos de Authentication

- Normal SQL Statement
  - Use
  - Show databases
  - Show tables
  - Create / Drop database
  - Create / Drop table
  - Insert
  - Delete
  - Update
  - Select
  - Grant

- Remote Access

```

## Project Schedule

```
- Front-end interface design :triangular_flag_on_post:

  - Create database
    data: {
      method[string],
      table[string]
    }
    
  - Create table
    data: {
      method[string], 
      table[string],
      rowParameter[array]
    } 

  - Insert into
    data: {
      method[string],
      limitBody[string],
      table[string],
      values[array]
    }
    
   - Update
     data: {
     	OPVALUE[Object]: {
	  key[string],
	  value[string]
	},
	RESSET[Object]: {
	  arrRes[array],
	  pointStr[string]
	},
	table[array]: {
	  table[string],
	  alias[string]
	}
	
     }
```

## Example 

#### Input (Create database)

     let sql = `
    		  create 
    		database  cilicili 
    	`


#### Input (Create table)

     let sql = `
      create    table    
    
         t1 (
               name varchar ( 30    )  not     null   default  'ccl_ad'  primary  key  default  'smile_key'  unique   ,
           age int not    null     unique  ,
               gender  varchar(5)   not    null
      )`

  


#### Input (Insert into)

     let test22 = `
    		insert    into     
          table1
    	  ("age", "name", "like", "sport") 
    	 value(4, "dasd", "rrw", "ca") , 
    	    ("123", "dasd", "rrw", "ca") ,   ("123", "dasd", "rrw", "ca") ,   ("1235", "dasd", "rrw", "ca")
    	`


#### Input (Update)

     let sql = `
    	update   
    	admin as a, user as u, code
    	set     
    	a.password = 10010, a.username = "Ashen",
    	u.password = 10011, u.username = "King"
    	where a.id = u.id = code.uid and (a.age > 19 or a.num = 13) or u.age < 12 and code.num = 1.8 or cid = 17
    `


 * I am lazy and for technical reasons, the retrieval problem is simplified, only to achieve [ and, or, ), ( ] four non-recursive   retrieval methods, the "pointStr" text involved in the retrieval method is optimized on the basis of RPN, to provide the retrieval       logic for the back end. 

## Navegadores Soportados

Navegadores modernos e Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| últimas 2 versiones| últimas 2 versiones| últimas 2 versiones

## License

[GNU General Public License v3.0](https://github.com/FinalAshen/MySQL-Simulation/blob/master/LICENSE)