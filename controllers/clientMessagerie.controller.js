
var Imap = require('imap'),
    inspect = require('util').inspect;
const fs = require('fs')
var imap = new Imap({
    user: 'youssef.ayari1@esprit.tn',
    password: 'Ayarinhomessinho12',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
});



  
function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}
var array = [];
var emails = [];

exports.getEmails = async (req, res, next) => {


  await  imap.once('ready', function() {
        openInbox(function(err, box) {
          if (err) throw err;
          var f = imap.seq.fetch('8000:8500', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
          });
          f.on('message', function(msg, seqno) {
            //console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
              var buffer = '';
              stream.on('data', function(chunk) {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', function() {
               // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                
               array.push(Imap.parseHeader(buffer));

               console.log(Imap.parseHeader(buffer))
    
              });
    
    
            });
    
    
            msg.once('attributes', function(attrs) {
             // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
    
    
            msg.once('end', function() {
             // console.log(prefix + 'Finished');
            });
    
    
          });
    
    
          f.once('error', function(err) {
            console.log('Fetch error: ' + err);
          });
    
    
          f.once('end', function() {
           // console.log('Done fetching all messages!');
            imap.end();
          });
    
    
        });

        if (array.length >= 20) {
    
            emails = array;
    
          return res.json(emails)
    
        }else {
    
            return res.json(emails)
    
             }
     });
       
      imap.once('error', function(err) {
        console.log(err);
      });
       
      imap.once('end', function() {
        console.log('Connection ended');
      });

      imap.connect();

  
}

