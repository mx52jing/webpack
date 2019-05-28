const foo = () => {
    console.log('foo');
}
foo()
class Foo {
    state = {
        name: 'asd'
    }
}

console.log(new Foo());

const str = 'asdasdasd'

console.log(str.includes('s'));

new Promise((resolve, reject) => {
    console.log(111);
})

function * baz() {
    yield 'hello'
}

const it = baz()

console.log(it.next());
