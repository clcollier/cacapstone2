const express = require('express');
const employeeRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const bodyParser = require('body-parser');

employeeRouter.use(bodyParser.json());

//Return all currently saved employees
employeeRouter.get('/', (req, res, next)=>{
  db.all('SELECT * FROM Employee WHERE is_current_employee=1', (error, rows)=>{
    //Pass any errors to next middleware
    if(error){
      next(error);
    }else{
      //Otherwise return results on employees property with status 200
      return res.status(200).send({employees:rows});
    }
  });
});

employeeRouter.get('/:id', (req, res, next)=>{
  //Get Employee by id
  db.get('SELECT * FROM Employee WHERE id=$id', {$id: req.params.id}, (error, row)=>{
    //Pass any errors to next middleware
    if(error){
      next(error);
    }else{
      //Otherwise examine the row object
      //If undefined, id was invalid, return 404
      if (row === undefined){
        return res.status(404).send();
      }else{
        //Otherwise return 200 and the row on the employee property
        return res.status(200).send({employee:row});
      }
    }
  });
});

employeeRouter.post('/', (req, res, next)=>{
  const employee = req.body.employee;

  //Return status 400 if required fields are missing
  if (!employee.name || !employee.position || !employee.wage){
    return res.status(400).send();
  }

  //Insert employee into database
  db.run('INSERT INTO Employee (name, position, wage) VALUES ($name, $position, $wage)', {
    $name: employee.name,
    $position: employee.position,
    $wage: employee.wage
  }, function(error){
    //Pass any errors to next middleware
    if (error){
      next(error);
    }else{
      //Else get inserted employee using this.lastID
      db.get('SELECT * FROM EMPLOYEE WHERE id=$id', {$id: this.lastID}, (error, row)=>{
        //Pass any errors to the next middleware
        if (error){
          next(error);
        }else{
          //Else return results on employee property with 201 status
          res.status(201).send({employee:row});
        }
      });
    }
  });
});

employeeRouter.put('/:id', (req, res, next)=>{
  const employee = req.body.employee;
  //Return 400 for invalid updates
  if (!employee.name || !employee.position || !employee.wage){
    return res.status(400).send();
  }
  //Update employee
  db.run('UPDATE Employee SET name=$name, position=$position, wage=$wage WHERE id=$id', {
    $name: employee.name,
    $position: employee.position,
    $wage: employee.wage,
    $id: req.params.id
  }, function(error){
      //Pass any errors to next middleware
      if (error){
        next(error);
      }else{
        //Otherwise retrieve updated employee
        db.get('SELECT * FROM Employee WHERE id=$id', {$id: req.params.id}, (error, row)=>{
          //Pass any errors to next middleware
          if(error){
            next(error);
          }else{
            //Otherwise return 200 and the updated row on the employee property
            return res.status(200).send({employee:row});
          }
        });
      }
  });
  return res.send();
});

module.exports = employeeRouter;
