/*
Annotator nodejs store (https://https://github.com/albertjuhe/annotator_nodejs_store
Copyright (C) 2014 Albert Juhé Brugué
License: https://github.com/albertjuhe/annotator_nodejs_store/License.rst

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*/
var MySQL = require('../database/mysql');
var log4js = require('log4js');
var logger  = log4js.getLogger('loggerAnotacionsFile');
var loggerConsole = log4js.getLogger('loggerAnotacionsConsole');
var estadistiquesDAO = require('../DAO/estadistiques');

var Annotation = function(){

	var mysql = new MySQL();

	var prepararJSON = function(str){
		cleaningNoComas = str.substring(1, str.length);
		cleaningNoComas = cleaningNoComas.substring(0, cleaningNoComas.length-1);
		return cleaningNoComas;
	}

	var get = function(username,code,callback){
		var estadistiques = new estadistiquesDAO();
		estadistiques.get(code,username);
		
		var  query_select = "select * from anotacions where (state=1 and code='"+code+"') or (state=0 and username='"+username+"' and code='"+code+"')  order by sort";
		
		mysql.query(query_select,function(err,rows,fields){
		  if (err) throw err;		
		  callback(rows);
		});
	};

	var find = function(id_annotation,callback){
		var query_select = "select * from anotacions where id = "+id_annotation;
		
		mysql.query(query_select,function(err,rows,fields){
			if (err) throw err;
		  	callback(rows);
		});
	};

	var getAll = function(username,code,callback){
		var estadistiques = new estadistiquesDAO();
		estadistiques.getAll(username,code);

		query_select = "select * from anotacions where (state=1 and code='"+code+"') or (state=0 and username='"+username+"')  order by sort";
		
		mysql.query(query_select,function(err,rows,fields){
			if (err) throw err;			
		  	callback(rows);
		});
	};

	var add = function(code,username,json_object,callback){
			mysql.clean(JSON.stringify(json_object),function(limpio){
			cleaningNoComas= prepararJSON(limpio);			
			var state = 0;
			
			if (json_object.permissions.read.length === 0) state = 1;			
			
			var estadistiques = new estadistiquesDAO();
		  	estadistiques.add(username,code);

			query = 'INSERT INTO anotacions (username,code,json_anotation,sort,type_annotation,state) VALUES ("'+username+'","'+code+'","'+cleaningNoComas+'","'+json_object.order+'","'+json_object.category+'",'+state+');';
		    console.log(query);
			mysql.query(query,function(err,rows,fields){				
			 if (err) throw err;
			  callback(rows);
			});
		});
	}

	var update = function(username,json_object,anotation_id,callback){
	
		mysql.clean(JSON.stringify(json_object),function(limpio){
			cleaningNoComas= prepararJSON(limpio);
			var state = 0;			
			if (json_object.permissions.read.length === 0) state = 1;	

			var estadistiques = new estadistiquesDAO();
		  	estadistiques.update(username,anotation_id);

			query = 'UPDATE `anotacions` SET `json_anotation` = "'+cleaningNoComas+'",state='+state+' WHERE `id` = '+anotation_id+' and username="'+username+'";';
			mysql.query(query,function(err){				
			 	if (err) {
			 		callback(err);
			 	}			 	
			   	callback();
			});
		});
	}

	var deleteAnnotation = function(username,anotation_id,callback){
		query = 'DELETE FROM anotacions WHERE id = '+anotation_id+' and username="'+username+'";';
		
		mysql.query(query,function(err){
		 	if (err) {
			 		callback(err);
			 	}
		 	var estadistiques = new estadistiquesDAO();
		  	estadistiques.deleteAnnotation(username,anotation_id);
		  	callback();
		});
	}


	return {get:get,add:add,update:update,deleteAnnotation:deleteAnnotation,getAll:getAll,find:find}
	 
};
module.exports = Annotation;
