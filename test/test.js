const assert = require('assert');
const firebase = require('@firebase/testing');
const { doesNotMatch } = require('assert');

const MY_PROJECT_ID = 'test-rules-7f353';

describe("Our social app", () => {
    it("Understands basic addition", () => {
        assert.equal(2+2, 4);
    })

    // it("Can read items in the collection", async () => {
    //     const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
    //     const testDoc = db.collection("users").doc("testDoc");
    //     await firebase.assertSucceeds(testDoc.get());
    // })

    // it("Can't write to items in the collection", async () => {
    //     const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
    //     const testDoc = db.collection("users").doc("testDoc");
    //     await firebase.assertSucceeds(testDoc.get());
    // })

    it('Can write to a user document with the same ID as our user', async () => {
        console.log('1');
        const myAuth = {uid: "p80vTK1RcHNsCEETahoONQc4EBh1", email: "oleg@gmail.com"};
        console.log('2');
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuth}).firestore();
        console.log('3');
        const testDoc = db.collection("users").doc("p80vTK1RcHNsCEETahoONQc4EBh1");
        console.log('4222');
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
        console.log('5');
    })

    it('Cant write to a user document with the same ID as our user', async () => {
        console.log('1');
        const myAuth = {uid: "p80vTK1RcHNsCEETahoONQc4EBh2", email: "oleg@gmail.com"};
        console.log('2');
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuth}).firestore();
        console.log('3');
        const testDoc = db.collection("users").doc("p80vTK1RcHNsCEETahoONQc4EBh1");
        console.log('4222');
        await firebase.assertFails(testDoc.set({foo: "bar"}));
        console.log('5');
    })
    

})