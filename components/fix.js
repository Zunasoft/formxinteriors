const fs = require('fs');
let content = fs.readFileSync('d:/Rajesh_zunasoft/formX-20-08/Archive 2/components/Advantage.js', 'utf8');
content = content.replace(/\/ \/>/g, '/>');
content = content.replace(/aria-hidden="true"/g, 'aria-hidden={true}');
content = content.replace(/aria-current="true"/g, 'aria-current={true}');
content = content.replace(/aria-current="false"/g, 'aria-current={false}');
fs.writeFileSync('d:/Rajesh_zunasoft/formX-20-08/Archive 2/components/Advantage.js', content);
