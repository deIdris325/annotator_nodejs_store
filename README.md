Annotator with Nodejs + express + socket.io + MySQL
==================

##Annotator with Nodejs + express + socket.io + MySQL

Is a sample and a simple aplication that uses the Annotateit (http://annotateit.org/) with nodejs and Mysql as a back store.
There is a folder called demoNodejs, this folder contains a  demo and several plug-ins, a category plug-in, store plug-in, and a panel viewer plugin (https://github.com/okfn/annotator/wiki). 
This aplication let you store, delete and update annotations, export anotations to PDF, display annotations in a right panel viewer, create annotations with Tinymc, and categorize this annotations.
The annotations are displayed in the right panel with an icon for deleting, and a little eye, it means that the annotations is shared. I fyou are the owner of the annotations your username is displayed in a white background, if not it is displayed in a brown background.

##Complete Demo

[Demo Frankenstein](http://ec2-54-191-181-65.us-west-2.compute.amazonaws.com:3060/annotation/mary/demo.html)

Its a completely opened demo, you can use all the users that you want without security, its a demo.
If you want to change the user, you only have to change the user in the URL:
http://ec2-54-191-181-65.us-west-2.compute.amazonaws.com:3060/annotation/user/demo.html

I've created a [mary](http://ec2-54-191-181-65.us-west-2.compute.amazonaws.com:3060/annotation/mary/demo.html) and [testuser] (http://ec2-54-191-181-65.us-west-2.compute.amazonaws.com:3060/annotation/testuser/demo.html).

##Demo

You can execute after the installation with: node node_aplicaction_folder/app.js
You can try with this URL:
http://localhost:3000/annotation/testuser1/demo.html
and test with other users
http://localhost:3000/annotation/testuser2/demo.html
http://localhost:3000/annotation/testuser3/demo.html

In the annotator display panel you can see the users that are currently viewing the same content, the same contens means the same HTML file.

##Installation

You need install several in the nodejs folder package before start (npm install):
- express (http://expressjs.com/)
- i18n (https://github.com/mashpie/i18n-node)
- log4js (https://github.com/nomiddlename/log4js-node)
- underscore
- mysql
- http
- request
- wkhtmltopdf (Export annotaions to PDF format) (https://www.npmjs.org/package/wkhtmltopdf)
- socket.io (http://socket.io/) Who is reading the content. Chat rooms in the future.

Copy the content of the github into the nodejs folder.
Inside this folder there is a file called config.json, is the config file.

```json
 {
    "materials": "http://localhost/demoNodejs/",
    "server": "localhost",
    "user": "root",
    "password": "",
    "database": "annotations",   
    "database_port":3306,
    "port": 3000

}
```

materials: URL where we can find documents.
server: database server
user:database user
password: database password
port: port where we can find the aplication

You have to copy the folder: demoNodejs into your http server (ex:C:\wamp_server\www\demoNodejs).

For the PDF export anotations, firts install wkhtmltopdf and configure it, follow the web site instructions.
After this you have to update the app.js file, you have to change the line:

```nodejs
 __dirname = 'C:\\wamp_server\\www\\demoNodejs\\';
```

 and change for the folder where are the js,css,locale,etc..., if you follow the installation steps you can't change this line.

 Inside the sql folder you can find the database sample structure that I have created, open the sql files and execute the content in a mysql database.

The file that you have to execute is app.js, ex:nodejs folder_name/app.js and from the browser, If you haven't change the port, with http://localhost:3000/annotation/testuser/demo.html, if you want to test with diferent user only change the username.

demo.html is the file that you can find inside the demoNodejs, you can copy other files inside this folder and put the annotateit javascript inside to test with other files.

After the excution you can find a log files in the log folder.

##Development

Atention:The core of the annotator has been modified for the categories.js plugin.

- All the routing in the nodejs application are in the lib\rest\buffer.js
- update annotation: app.put('/annotation/update/:username/:code/:id', function(req, res)
- delete annotation app.delete('/annotation/destroy/:username/:code/:id', function(req, res) 
- get annotations app.get('/annotation/get/:username/:code', function(req, res)
- get HTML file and render: app.get('/annotation/:username/:code.html', function(req, res)
- new annotation: app.post('/annotation/new/:username/:code', function(req, res)
- get annotations in pdf format: app.get('/annotation/:username/:code.pdf', function(req, res)

When a user is displaying a document for example:
http://localhost:3000/annotation/testuser2/demo.html nodejs are executing (get), the aplication search in the anotations table, all the annotations belonging to testuser2 with code equal to demo.

##Plugins

There are a several Annotator plugins:
- Panel Viewer Plugin (demoNodejs/js/visoanotacions.js)
- Categorization plugin (demoNodejs/js/categories.js)
- RichEditor Plugin (demoNodejs/js/richEditor.js) Use tinymc 4.0

##Database

there are two tables:
Table anotacions where we store annotations.
Table log where we store the logs.


Inside the file demoNodejs/demo.html you can find the store plug-in configuration, with the rest services.

```html
 <script>
      var socket = io.connect('http://localhost:3000');
      var propietary = '{$__propietary__$}';
      var code = '{$__code__$}';

      jQuery(function($) {
                    //Internazionalization
                    $.i18n.load(i18n_dict);
                   
                 
                    var annotator = $('body').annotator().annotator().data('annotator');
                    annotator.addPlugin('Permissions', {
                        user: propietary,
                        permissions: {
                            'read': [propietary],
                            'update': [propietary],
                            'delete': [propietary],
                            'admin': [propietary]
                        },
                        showViewPermissionsCheckbox: true,
                        showEditPermissionsCheckbox: false
                    });
                       $('body').annotator().annotator('addPlugin', 'Categories',{
                           errata:'annotator-hl-errata',
                           destacat:'annotator-hl-destacat',
                           subratllat:'annotator-hl-subratllat' }
                     );
                   $('body').annotator().annotator('addPlugin', 'RichEditor');
                   $('body').annotator().annotator('addPlugin', 'Markdown');
                   $('body').annotator('addPlugin', 'Store', {
                        prefix: 'http://localhost:3000/annotation',
                        urls: {
                            // These are the default URLs.
                            create: '/new/'+propietary+'/'+code,
                            read: '/get/'+propietary+'/'+code,
                            update: '/update/'+propietary+'/'+code+'/:id',
                            destroy: '/destroy/'+propietary+'/'+code+'/:id'
                        }
                    });
                   $('body').annotator().annotator('addPlugin', 'visorAnotacions');
               jQuery("body").annotator().annotator('addPlugin', 'Touch', {
               force: location.search.indexOf('force') > -1,
               useHighlighter: location.search.indexOf('highlighter') > -1
               });
                   $('#anotacions-uoc-panel').slimscroll({height: '100%'});
                });

         socket.emit('login', { username: propietary });
         socket.emit('join',code);

         socket.on('notification', function (data) {
            var n = data.online;
             $('#count-anotations-alert').text(n);
           
      });
      </script>
```

      The content of the variable propietary are overwrite by the nodejs,   

      var propietary = '{$__propietary__$}';
      var code = '{$__code__$}';.

      Its important that the socket.io connection 
      var socket = io.connect('http://localhost:3000'); 
      use the same port than the nodejs.


