const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = 'test-rules-7f353';

const myId = "p80vTK1RcHNsCEETahoONQc4EBh1";
const theirId = "p80vTK1RcHNsCEETahoONQc4EBh2";
const myAuth = { uid: myId, email: "oleg@gmail.com" };



function getFirestore(auth) {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
}

function getAdminFirestore() {
    return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
    
})

describe("Our social app", () => {
    it("Understands basic addition", () => {
        assert.equal(2 + 2, 4);
    })

    it("Can't write to  the user collection if is not signed in", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection("users").doc("testDoc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
            })

    it('Can write a user document with the same ID as our user', async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(myId);
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    })

    it("Can't  write a user document with the different ID as our user", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(theirId);
        await firebase.assertFails(testDoc.set({ foo: "bar" }));
    })
    

    it("Can read the usercollection if signedIn", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(myId);
        await firebase.assertSucceeds(testDoc.get());
    })

    it("Can query submitted profile", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("users").where("profileSubmitted", "==", true);
        await firebase.assertSucceeds(testQuery.get());
    })

    it("Can't query unsubmitted profile if auth == null", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("users").where("profileSubmitted", "==", false);
        await firebase.assertFails(testQuery.get());
    })

    it("Can't query other's unsubmitted profiles if myAuth", async () => {
        const db = getFirestore(myAuth);
        const testQuery = db.collection("users").where("profileSubmitted", "==", false);
        await firebase.assertFails(testQuery.get());
    })
    
    
    it('can be created by the profile owner', async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(myId);
        await firebase.assertSucceeds(testDoc.set({
            foo: "bar"
        }));
    })

    it("Can't query all profiles", async () => {
        const db = getFirestore(myAuth);
        const testQuery = db.collection("users");
        await firebase.assertFails(testQuery.get());
    })
    
    it("Can read a single submitted profile", async () => {
        const admin = getAdminFirestore();
        const postId = theirId
        const setupDoc = admin.collection("users").doc(theirId);
        await setupDoc.set({ authorId: theirId, profileSubmitted: true });

        const db = getFirestore(null);
        const testRead = db.collection("users").doc(postId);
        await firebase.assertSucceeds(testRead.get());
    })

        
    it("Can query all submitted profile if signedIn", async () => {
        const db = getFirestore(myAuth);
        const testQuery = db.collection("users").where("profileSubmitted", "==", true);
        await firebase.assertSucceeds(testQuery.get());
    })

    it("Can query all submitted profile if auth = null", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection("users").where("profileSubmitted", "==", true);
        await firebase.assertSucceeds(testQuery.get());
    })
});

after(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
})

