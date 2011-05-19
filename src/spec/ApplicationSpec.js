describe("Application", function() {

    var application;

    // Set these for testing.
    var config = {username: 'XXXX', key: 'XXXX'};

    beforeEach(function() {
        application = new Application();
    });

    it("should be able to load a provided configuration", function() {
        application.loadConfig(config);
        expect(application.settings.key).toEqual(config.key);
        expect(application.settings.username).toEqual(config.username);
    });

    it("should create a nzbmatrix object.", function() {
        application.loadConfig(config)
        expect(application.nzbMatrix).
    });
});