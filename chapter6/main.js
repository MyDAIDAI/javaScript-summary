let person = {};
person.name = 'nicklos';
Object.defineProperty(person, 'name', {
  writable: false,
  configurable: false
});
person.name = 'hello'
console.log(person.name)
delete person.name
console.log(person)