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
var express = require('express'),
    app = express()
  , http = require('http')
  , log4js = require('log4js')
  , i18n = require("i18n")
  , server = http.createServer(app);
var config = require('./config.json');

//__dirname = 'C:\\wamp_server\\www\\demoNodejs\\';
__dirname = 'C:\\nodejs\\plug_in_nodejs\\demoNodejs\\';

//Language configuration
i18n.configure({
    locales:['ca','es','en', 'fr'],
    directory: __dirname + 'locale',
    defaultLocale: 'en'
});

// Logger configuration
log4js.configure({
 appenders: [
   { type: 'console', category: 'loggerAnotacionsConsole' },
   { type: 'file', filename: './logs/anotacions.log', category: 'loggerAnotacionsFile' }
  ]
});

var logger = log4js.getLogger('loggerAnotacionsFile');
logger.setLevel('TRACE');
var loggerConsole = log4js.getLogger('loggerAnotacionsConsole');
loggerConsole.setLevel('TRACE');

app.set('port', config.port);
app.set('url_materials', config.materials);
app.set('mySql', config.mySql);
app.set('user', config.user);
app.set('password', config.password);

app.configure(function(){
	app.use(express.json());
  app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname));
	app.use('/annotator/css', express.static(__dirname + '/css'));
	app.use('/annotator/img', express.static(__dirname + '/img'));
  app.use('/annotator/js',express.static(__dirname + '/js'));
  app.use('/annotator/locale',express.static(__dirname + '/locale'));
  app.use('/css', express.static(__dirname + '/css'));
  app.use('/img', express.static(__dirname + '/img'));
  app.use('/js',express.static(__dirname + '/js'));
  app.use('/locale',express.static(__dirname + '/locale'));
  app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));
  app.use(i18n.init); //i18n Multiidioma
})

require('./lib/router/router')(app);

var port  = config.port;

server.listen(port);
loggerConsole.debug("Loaded." + config.port);
logger.debug("Loaded..." + config.port);
app.set('server',server);

//socket io
var comunication = require('./lib/sockets/comunication');
var cmq = new comunication();
cmq.init(app);
