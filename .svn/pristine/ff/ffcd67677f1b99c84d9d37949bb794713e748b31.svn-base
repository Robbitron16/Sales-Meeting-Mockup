//=======================================================
//=======================================================
describe("Cloud save", function() {

	var CloudSave;

	var success, fail;
	var mockPromise = {
		then: function(s, f) {success = s; fail = f;},
		reject: function() {fail(arguments)},
		resolve: function() {success(arguments)}
	}

	var mockComm = {
		save: function(){ return mockPromise }
	}

	var mockCallback = {
		cb: function() {}
	}

	//=======================================================
	//=======================================================
	beforeEach(function() {
		module('action-service');

		inject(function($injector) {
			CloudSave = $injector.get('CloudSave');
		});
	});

	//=======================================================
	//=======================================================
	beforeEach(function() {
		jasmine.Clock.useMock();

		spyOn(mockComm, 'save').andCallThrough();
		spyOn(mockCallback, 'cb');
		CloudSave.init(mockComm.save, null, mockCallback.cb);
	});

	//=======================================================
	//=======================================================
	describe("add", function() {

		//=======================================================
		//=======================================================
		it("should send a request with a single action", function() {

			CloudSave.add('id1', {test: 'data1'});

			jasmine.Clock.tick(999);
			expect(mockComm.save).not.toHaveBeenCalled();

			jasmine.Clock.tick(1);
			expect(mockComm.save.callCount).toBe(1);
			expect(mockComm.save).toHaveBeenCalledWith([{test:'data1'}]);
		});

		//=======================================================
		//=======================================================
		it("should remove redundant requests before transmission", function() {
			CloudSave.add('id1', {test: 'data1'});
			CloudSave.add('id1', {test: 'data2'});

			jasmine.Clock.tick(1000);
			expect(mockComm.save.callCount).toBe(1);
			expect(mockComm.save).toHaveBeenCalledWith([{test:'data2'}]);
		});

		//=======================================================
		//=======================================================
		it("should transmit multiple non-redundant requests in a single transmission", function() {
			CloudSave.add('id1', {test: 'data1'});
			CloudSave.add('id2', {test: 'data2'});

			jasmine.Clock.tick(1000);
			expect(mockComm.save.callCount).toBe(1);
			expect(mockComm.save).toHaveBeenCalledWith([{test:'data1'}, {test:'data2'}]);
		});

		//=======================================================
		// This also tests delay between transmissions
		//=======================================================
		it("should queue up and send requests added during transmission", function() {
			CloudSave.add('id1', {a: 'a'});
			jasmine.Clock.tick(1000);
			CloudSave.add('id2', {b: 'b'});

			expect(mockComm.save.callCount).toBe(1);
			expect(mockComm.save).toHaveBeenCalledWith([{a:'a'}]);

			mockPromise.resolve();
			jasmine.Clock.tick(1000);

			expect(mockComm.save.callCount).toBe(2);
			expect(mockComm.save).toHaveBeenCalledWith([{b:'b'}]);
		});

		//=======================================================
		//=======================================================
		it("should resend on transmission failure", function() {
			CloudSave.add('id1', {a: 'a'});
			jasmine.Clock.tick(1000);

			mockPromise.reject();
			expect(mockComm.save.callCount).toBe(2);
			expect(mockComm.save.mostRecentCall.args).toEqual([[{a:'a'}]]);
		});

		//=======================================================
		//=======================================================
		it("should add any extra non-redundant requests on retransmission due to failure", function() {
			CloudSave.add('id1', {a: 'a'});
			jasmine.Clock.tick(1000);
			CloudSave.add('id2', {b: 'b'});

			mockPromise.reject();
			expect(mockComm.save.callCount).toBe(2);
			expect(mockComm.save.mostRecentCall.args).toEqual([[{a:'a'},{b:'b'}]]);
		});

		//=======================================================
		//=======================================================
		it("should remove new redundant requests on retransmission due to failure", function() {
			CloudSave.add('id1', {a: 'a'});
			jasmine.Clock.tick(1000);
			CloudSave.add('id1', {b: 'b'});

			mockPromise.reject();
			expect(mockComm.save.callCount).toBe(2);
			expect(mockComm.save.mostRecentCall.args).toEqual([[{b:'b'}]]);
		});

	});

	//=======================================================
	//=======================================================
	describe("isIdle", function() {

		//=======================================================
		//=======================================================
		it("should report Idle before any requests", function() {
			expect(CloudSave.isIdle()).toBe(true);
		});

		//=======================================================
		//=======================================================
		it("should report Idle after requests complete", function() {
			CloudSave.add('id1', {test: 'data1'});
			jasmine.Clock.tick(1000);
			mockPromise.resolve();

			expect(CloudSave.isIdle()).toBe(true);
		});

		//=======================================================
		//=======================================================
		it("should report Not Idle during transmissions", function() {
			CloudSave.add('id1', {test: 'data1'});
			jasmine.Clock.tick(1000);

			expect(CloudSave.isIdle()).toBe(false);
		});

		//=======================================================
		//=======================================================
		it("should report Not Idle while waiting for transmission", function() {
			CloudSave.add('id1', {test: 'data1'});

			expect(CloudSave.isIdle()).toBe(false);
		});
	});	// isIdle

	//=======================================================
	//=======================================================
	describe("isSaving", function() {

		//=======================================================
		//=======================================================
		it("should report Not Saving before any requests", function() {
			expect(CloudSave.isSaving()).toBe(false);
		});

		//=======================================================
		//=======================================================
		it("should report Not Saving while waiting for transmission", function() {
			CloudSave.add('id1', {test: 'data1'});

			expect(CloudSave.isSaving()).toBe(false);
		});

		//=======================================================
		//=======================================================
		it("should report Saving during transmission", function() {
			CloudSave.add('id1', {test: 'data1'});

			jasmine.Clock.tick(999);
			expect(CloudSave.isSaving()).toBe(false);

			jasmine.Clock.tick(1);
			expect(CloudSave.isSaving()).toBe(true);
		});

		//=======================================================
		//=======================================================
		it("should report Not Saving after transmission", function() {
			CloudSave.add('id1', {test: 'data1'});
			jasmine.Clock.tick(1000);
			mockPromise.resolve();

			expect(CloudSave.isSaving()).toBe(false);
		});

		//=======================================================
		//=======================================================
		it("should report Saving during retransmission due to failure", function() {
			CloudSave.add('id1', {test: 'data1'});
			jasmine.Clock.tick(1000);
			mockPromise.reject();

			expect(CloudSave.isSaving()).toBe(true);
		});

	});	// isSaving

	//=======================================================
	//=======================================================
	describe("external notification", function() {

		//=======================================================
		//=======================================================
		it("should perform a callback on successful saves", function() {
			CloudSave.add('id1', {test: 'data1'});
			jasmine.Clock.tick(1000);

			expect(mockCallback.cb).not.toHaveBeenCalled();
			mockPromise.resolve();
			expect(mockCallback.cb).toHaveBeenCalled();
		});

	});

});