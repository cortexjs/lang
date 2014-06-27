var assert = require('assert');
var lang = require('../index');

expect = assert;


function poll(checker, callback){
    var timer = setInterval(function() {
        if(checker()){
            clearInterval(timer);
            callback();
        }
    }, 10);
}

describe('lang.mix(receiver, sender, override, copylist)', function(){
    it("always returns the receiver itself", function(){
        var receiver = {
            a: 1,
            b: 2,
            c: 3
        };
    
        expect(lang.mix(receiver, {a: 2}) === receiver);
        expect(lang.mix(receiver, {a: 1}, false) === receiver);
        expect(lang.mix(receiver, {a: 1}, false, ['b', 'c']) === receiver);
    });

    it('could mix an object to the receiver', function(){
        var receiver = {
                a: 1,
                b: 2,
                o: {
                    a: 1,
                    b: 2
                }
            },
            
            sender = {
                b: 22,
                c: 3,
                o: {
                    c: 3
                },
                
                d1: {
                    a: 1
                },
                
                d2: {
                    a: 2
                },
                
                d3: 3
            };
            
        // default to override
        lang.mix(receiver, sender);
            
        expect( receiver.a === 1);
        expect( receiver.b === 22);
        
        // override
        expect( receiver.o.a === undefined);
        expect( receiver.o.c === 3);
    });
    
    it('could mix an object to the receiver, excluding existed members', function(){
        var receiver2 = {
                a: 1,
                b: 2,
                o: {
                    a: 1,
                    b: 2
                }
            },
            
            sender = {
                b: 22,
                c: 3,
                o: {
                    c: 3
                },
                
                d1: {
                    a: 1
                },
                
                d2: {
                    a: 2
                },
                
                d3: 3
            };
            
        // no override
        lang.mix(receiver2, sender, false);
            
        // no override
        expect( receiver2.b === 2);
        expect( receiver2.o.a === 1);
    });
    
    it('could mix an object to the receiver, according to a copy list', function(){
        var receiver3 = {
                a: 1,
                b: 2,
                o: {
                    a: 1,
                    b: 2
                }
            },
            
            sender = {
                b: 22,
                c: 3,
                o: {
                    c: 3
                },
                
                d1: {
                    a: 1
                },
                
                d2: {
                    a: 2
                },
                
                d3: 3
            };
            
        // override by a copy list
        lang.mix(receiver3, sender, true, ['d1', 'd2']);
            
        expect( receiver3.b === 2);
        expect( receiver3.d1.a === 1);
        expect( receiver3.d3 === undefined);
    });
    
    it('could mix an object to the receiver, with mixed condition', function(){
        var receiver4 = {
                a: 1,
                b: 2,
                o: {
                    a: 1,
                    b: 2
                }
            },
            
            sender = {
                b: 22,
                c: 3,
                o: {
                    c: 3
                },
                
                d1: {
                    a: 1
                },
                
                d2: {
                    a: 2
                },
                
                d3: 3
            };
            
        lang.mix(receiver4, sender, false, ['o', 'd1', 'd3']);
        // not override
        expect( receiver4.o.c === undefined);
        expect( receiver4.o.a === 1);
        
        expect( receiver4.d2 === undefined);
        expect( receiver4.d3 === 3);
    });
});


describe('lang.each()', function(){
    it("returns undefined", function(){
        var c = {
                a: 1,
                b: 2
            },
            
            obj_receiver = {};
            
        var ret = lang.each(c, function(v, k){
            obj_receiver[k] = v;
        });
    
        expect(ret === undefined);
    });

    it('could iterate an object which created using {}', function(){
        var c = {
                a: 1,
                b: 2
            },
            
            obj_receiver = {};
            
        lang.each(c, function(v, k){
            obj_receiver[k] = v;
        });
        
        expect( obj_receiver.a === 1);
        expect( obj_receiver.b === 2);
    });
    
    it('would ignore the prototype', function(){
        function C(){};
        
        C.prototype = {
            a: 1
        };
        
        var d = new C,
            obj_receiver2 = {};
            
        d.b = 2;
            
        lang.each(d, function(v, k){
            obj_receiver2[k] = v;
        });
        
        expect( obj_receiver2.a === undefined);
        expect( obj_receiver2.b === 2);
    });
    
    
    it('could iterate an array', function(){
        var a = [1,2],
            arr_receiver = [];
            
        a.a = a;
        
        lang.each(a, function(v, i){
            arr_receiver[i] = v;
        });
        
        expect( arr_receiver[0] === 1);
        expect( arr_receiver[1] === 2);
    });
});


describe('lang.clone(object, filter)', function(){
    
    it('could clone an object', function(){
        // preparing origin data >>>>>>>>>>>>>>>>>>>>>>>>>>>
        var o = {
                a: {
                    a: 1,
                    b: 2,
                    c: {
                        d: {
                            e: 1
                        }
                    }
                },
                
                b: {
                    a: 11,
                    b: 22
                },
                
                date: new Date,
                
                regex: /abc/g
            },
            
            receiver;
            
        o.c = o;
        
        // receiver ------------------------------------
        // clone an object
        receiver = lang.clone(o);
        
        // test recursive object
        expect( receiver.c.a.b === 2);
        
        // alter original and cloned data
        o.d = 3;
        expect( receiver.d === undefined);
        
        // alter recursive object
        o.c.a.c.d.e = 11;
        expect( receiver.c.a.c.d.e === 1);
        
        receiver.a.a = 11;
        expect( o.a.a === 1);
        
        expect(receiver.date.getMonth() === o.date.getMonth());
    });
    
    it('could clone members of an object into a receiver', function(){
        var o2 = {
                a: {
                    a: 1,
                    b: 2,
                    c: {
                        d: {
                            e: 1
                        }
                    }
                },
                
                b: {
                    a: 11,
                    b: 22
                }
            },
            
            receiver2;
            
        o2.c = o2;
            
        // receiver2 ------------------------------------
        // clone an object into a receiver
        var receiver2 = lang.clone(o2, false);
        
        // test recursive object
        expect( receiver2.c.a.b === 2);
        
        // alter original and cloned data
        o2.d = 3;
        expect( receiver2.d === undefined);
        
        // alter recursive object
        o2.c.a.c.d.e = 11;
        expect( receiver2.c.a.c.d.e === 1);
        
        receiver2.a.a = 11;
        expect( o2.a.a === 1);
    });
    
    
    it('could clone an array', function(){
        var array = [1, 2, 3, 4],
            cloned;
            
        array.a = array;
            
        cloned = lang.clone(array);
        
        cloned[0] = 11;
        array[2] = 33;
        
        expect(cloned.length === 4);
        expect(array[0] === 1);
        expect(cloned[2] === 3);
        
        // recursive member
        expect(cloned.a[2] === 3);
    });
    
    it('could clone an mixed object', function(){
        var foo = function(){},
            p = document.getElementsByTagName('p')[0],
            obj = [
                {
                    a: 1,
                    b: [1, 2]
                },
                
                foo,
                p
            ],
            
            cloned = lang.clone(obj);
            
        obj[0].b[0] = 11;
            
        expect(cloned[0].b[0] === 1);
        expect(cloned[1] === foo);
        expect(cloned[2] === p);
    
    });
    
    
    it('could unlink the reference to its prototype', function(){
        var o3 = {
                a: {
                    a: 1,
                    b: 2,
                    c: {
                        d: {
                            e: 1
                        }
                    }
                },
                
                b: {
                    a: 11,
                    b: 22
                }
            },
            
            receiver3;
            
        o3.c = o3;
            
        function O3(){};
        O3.prototype = o3;
            
        // receiver3 ------------------------------------
        // unlink the reference of an object
        receiver3 = lang.clone(new O3);
        
        // change the value of a property in receiver3
        receiver3.a.a = 11;
        expect( o3.a.a === 1); // no affect with its prototype
        
        // the change of the prototype would not affect its instances
        o3.a.b = 22;
        expect( receiver3.a.b === 2)
    
    });
    
    
    it('could use clone filter', function(){
        var o32 = {
                a: {
                    a: 1,
                    b: 2,
                    c: {
                        d: {
                            e: 1
                        }
                    },
                    
                    d: {
                        e: {
                            f: 1
                        }
                    }
                },
                
                b: {
                    a: 11,
                    b: 22
                },
                
                c: 1,
                
                d: {
                    a: 11,
                    b: 22
                }
            },
            
            receiver32;
            
        function O32(){};
        O32.prototype = o32;
        
        // !important
        // * receiver4 * ------------------------------------
        // test filter
        var receiver32 = lang.clone(new O32, function(v, k, d){
        
            // only copy the first depth
            return d === 1;
            
        });
        
        expect(!!receiver32.a === true);
        expect(receiver32.a.a === undefined);
        expect(receiver32.c === 1);
        
    });
    
    it("could successfully clone a recursive object", function(){
        var a = {
            b: 1
        };
        
        // recursive
        a.a = a;
    
        var c = lang.clone(a);
    
        expect(c.a.a.a.b === 1);
    });   
});


describe('lang.bind()', function(){
    it('could bind a normal fn', function(){
        var context = {
                a: 1
            },
            
            obj = {
                a: 2,
                fn: function(){
                    return this.a;
                }
            },
            
            fn;
            
        fn = lang.bind(obj.fn, context);
        expect(fn() === 1);
    });
    
    
    it('could bind a singleton method', function(){    
        var context = {
                a: 1
            },
            
            obj2 = {
                a: 3,
                fn: function(){
                    return this.a;
                },
                
                bindFn: function(){
                    lang.bind('fn', context);
                }
            };
    
        obj2.bindFn();
        expect(obj2.fn() === 3);
    });
    
    it("could bind an instance method", function(){
        function A(){
            lang.bind('fn', this);  
        };
        
        A.prototype = {
            fn: function(){
                return this.a;
            },
            
            a: 1
        };
        
        var obj = {
            fn: new A().fn,
            
            a: 2
        }
    
        expect(obj.fn() === 1);
    });
        
});


describe('lang.makeArray(array, host)', function(){
    function checkArray(item){
        var converted = lang.makeArray(item);
        
        expect( lang.isArray( converted ) === true);
    };
    
    describe("lang.makeArray(array)", function(){
        it("test env requirements", function(){
            expect(!!document.getElementById === true);
            expect(!!document.getElementsByTagName === true);
        });
        
        it('would return the array itself, if alreay an array', function(){
            checkArray([]);
            
            var arr = [1, document.getElementsByTagName('p')];
            expect( lang.makeArray(arr) === arr);
            
        });
        
        it("lang.makeArray(undefined) -> lang.makeArray() -> []", function(){
            var result = lang.makeArray(undefined);
        
            expect(result.length === 0);
        });
        
        it("lang.makeArray(false) -> [false]", function(){
            var result = lang.makeArray(false);
        
            expect(result.length === 1);
            expect(result[0] === false);
        });
        
        
        it("lang.makeArray(null) -> []", function(){
            var result = lang.makeArray(null);
        
            expect(result.length === 0);
        });
        
        it('would wrap non-array objects and numeric variables', function(){
            checkArray();
            expect( lang.makeArray()[0] === undefined);
            
            checkArray(null);
            expect( lang.makeArray(null)[0] === undefined);
            
            checkArray(123);
            expect( lang.makeArray(123)[0] === 123);
            
            checkArray('STRING');
            expect( lang.makeArray('STRING')[0] === 'STRING');
            
            checkArray(window);
            expect( lang.makeArray(window)[0] === window);
            
            checkArray(document.body);
            expect( lang.makeArray(document.body)[0] === document.body);
        });
        
        it('would make NodeList as pure array', function(){
            var container = document.getElementById('lang-enhance-container');
        
            checkArray(container.getElementsByTagName('p'));
            checkArray(container.getElementsByTagName('select'));
            checkArray(container.getElementsByTagName('option'));
        });
    });
    
    
    describe("lang.makeArray(array, host)", function(){
        it("always returns the host itself", function(){
            var host = [],
                host2 = {};
        
            expect(lang.makeArray([1,2,3], host) === host);
            expect(lang.makeArray([1,2,3], host2) === host2);
        });
    
        // it("would copy the array to the host", function(){
        //     var array = [1, 2],
        //         host = [],
        //         host2 = {},
        //         host3 = lang.DOM();
                
        //     lang.makeArray(array, host);
        //     lang.makeArray(array, host2);
        //     lang.makeArray(array, host3);
        
        //     expect(host[0] === 1);
        //     expect(host2[0] === 1);
        //     expect(host2[1] === 2);
        // });
        
        // it("would manipulate the length property of the host", function(){
        //     var array = [1, 2],
        //         host = [],
        //         host2 = {},
        //         host3 = lang.DOM();
                
        //     lang.makeArray(array, host);
        //     lang.makeArray(array, host2);
        //     lang.makeArray(array, host3);
        
        //     expect(host.length === 2);
        //     expect(host2.length === 2);
        //     expect(host3.length === 2);
        // });
    });
});


describe("lang.makeArray.merge(array, host)", function(){
    it("will always treat the parameter as Array, even if it's not", function(){
        var obj = {
            length: 3
        },
        
        host = [];
        
        obj[0] = 1;
        obj[1] = 2;
        
        lang.makeArray.merge(obj, host);
    
        expect(host.length === 3);
        expect(host[0] === 1);
        expect(host[2] === undefined);
    });
});


describe('lang.template(template, data)', function(){
    

    it('could apply some parameters to a template', function(){
        var t = 'a:{a},b:{b}',
            p = {
                a: 1,
                b: 2
            };
            
        expect( lang.template(t, p) === 'a:1,b:2');
    });
    
    it('would not substitute escaped symbols', function(){
        var t = 'a:{a},b:\\{b}',
            p = {
                a: 1,
                b: 2
            };
            
        expect( lang.template(t, p) === 'a:1,b:{b}');
    });

    it('only substitute the most inner match of {}', function(){
        var t = 'a{{{a}}',
            p = {
                a: 1
            };
            
        expect( lang.template(t, p) === 'a{{1}');
    });
});


describe("lang.guid()", function(){
    it("could create an unique and increasing global id", function(){
        var base = lang.guid();
        
        expect(lang.guid() === base + 1);
        expect(lang.guid() === base + 2);
        expect(lang.guid() === lang.guid() === false);
    });
});


describe("lang.delay()", function(){
    it("returns an object contains two methods: start, cancel", function(){
        function a(){
            b = 2;
        };
        
        var b = 1,
            timer = lang.delay(a, 100);
    
        expect(lang.isObject(timer) === true);
        expect(lang.isFunction(timer.start) === true);
        expect(lang.isFunction(timer.cancel) === true);
    });
    
    describe("methods:", function(){
        it(".start() could start a timer, returns a number", function(done){
            function a(){
                b = 2;
            };
            
            var b = 1,
                timer = lang.delay(a, 10),
                ret = timer.start();
            
            poll(function() {
                return b !== 1;
            }, function() {
                expect(b === 2);
                expect(lang.isNumber(ret) === true);
                done();
            });
        });
        
        it(".cancel() could cancel a timer", function(done){
            function a(){
                b = 2;
            };
            
            var b = 1,
                flag = false,
                timer = lang.delay(a, 50);
            
            // little longer
            setTimeout(function(){
                flag = true;
            }, 100);
            
            timer.start();
            timer.cancel();
            
            poll(function() {
                return flag;

            }, function() {
                expect(b === 1);
                done();
            });
        });
    });
    
    it("the timer which canceled could start again", function(done){
        function a(){
            b = 2;
        };
        
        var b = 1,
            timer = lang.delay(a, 50),
            ret;
            
        timer.start();
        timer.cancel();
        ret = timer.start();

        poll(function() {
            return b !== 1;

        }, function() {
            expect(b === 2);
            expect(lang.isNumber(ret) === true);
            done();
        });
    });
});


describe("lang.toQueryString(object)", function(){
    it("could convert an object into a query string", function(){
        var obj = {
            a: 1,
            b: 2
        };
    
        expect(lang.toQueryString(obj) === 'a=1&b=2');
    });
});


describe('lang.overloadSetter()', function(){
    
    it('could overload a normal fn', function(){

        // test overload for normal function
        function setter(key, value){
            storage[key] = value;
        }
    
        var storage = {},
            batchSetter = lang.overloadSetter( setter );
        
        setter('a', 1);
        expect( storage.a === 1);
        
        batchSetter({
            a: 2,
            b: 3
        });
        expect( storage.a === 2);
        expect( storage.b === 3);
    });
    
    
    it('could overload a singleton method, and maintain the context', function(){    
        // test overload for singleton method
        var obj = {
                storage: {},
                setter: function(key, value){
                    this.storage[key] = value;
                },
                
                change: function(){
                    this.setter = lang.overloadSetter(this.setter);
                }
            };
            
        obj.setter('a', 1);
        expect( obj.storage.a === 1);
        
        obj.change();
        
        obj.setter({
            a: 2,
            b: 3
        });
        expect( obj.storage.a === 2);
        expect( obj.storage.b === 3);
    });
});


describe('lang.onceBefore()', function(){
    it('could swap two methods', function(){
        var obj = {
                real: function(){
                    return this.a;
                },
                
                fake: function(){
                    this.a = 2;
                }
            };
            
        expect( obj.real() === undefined);
        
        lang.onceBefore('real', 'fake', obj);
        
        expect( obj.real() === 2);
    });
    
    // it('would not do evil to prototype chain', function(){
    //     var K = NR,
    //         C = K.Class({
    //             initialize: function(v){
    //                 this.v = v;
    //             },
                
    //             _real: function(){
    //                 return this.v ++;
    //             },
                
    //             print: function(){
    //                 return this.v - 1;
    //             }
    //         });
            
    //     K.onceBefore('print', '_real', C.prototype);
        
    //     var c = new C(1),
    //         c2 = new C(1);
            
    //     expect(c.print() === c2.print());
    //     expect(c.print() === c2.print());
        
    //     // will not ruin the prototype
    //     expect(new C(3).print() === 3);
    // });
});


describe('lang.memoize(fn)', function(){
    it('could memoize the result of a function with number params', function(){
        function foo(){
            exec_counter ++;
            
            return Array.prototype.join.call(arguments, '_');
        };
        
        var exec_counter = 1,
            memoized_foo = lang.memoize( foo );
        
        memoized_foo(1, 2, 3); // exec_counter:2
        
        expect( memoized_foo(1, 2, 3) === '1_2_3');
        expect( memoized_foo(1, 2, 3) === '1_2_3');
        expect( exec_counter === 2);
        
        expect( memoized_foo(1, 2, 4) === '1_2_4');
        expect( exec_counter === 3);
        
    });
});


describe("lang.pushUnique(array, host)", function(){
    it("always returns the host", function(){
        var host = [1],
            array = [1,2,3];
    
        expect(lang.pushUnique(host, array) === host);
    });
    
    it("host can be an Object", function(){
        var obj_host = {
                length: 0
            },
            array = [1,2,3]
        
        
        expect(lang.pushUnique(obj_host, array) === obj_host);
        expect(obj_host[0] === 1);
        expect(obj_host[1] === 2);
        expect(obj_host.length === 3);
    });
    
    it("could prevent duplication", function(){
        var host = [1, 2],
            array = [2, 3];
            
        lang.pushUnique(host, array);
    
        expect(host.length === 3);
        expect(host.indexOf(2) === host.lastIndexOf(2));
    });
    
    it("could prevent duplication, even if `host` is an Array-like object", function(){
        var host = {},
            array = [2, 3];
        
        host[0] = 1;
        host[1] = 2;
        host.length = 2;
            
        lang.pushUnique(host, array);
    
        expect(host.length === 3);
    });
});