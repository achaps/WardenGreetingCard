const GreetingCard = artifacts.require("GreetingCard");

contract("GreetingCard", accounts => {
    let greetingCard;
    const owner = accounts[0];
    const recipient = accounts[1];
    
    before(async () => {
        // Déploiement avec les adresses de test
        const AXELAR_GATEWAY_TEST = "0xe432150cce91c13a887f7D836923d5597adD8E31";
        const AXELAR_GAS_SERVICE_TEST = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
        
        greetingCard = await GreetingCard.new(
            AXELAR_GATEWAY_TEST,
            AXELAR_GAS_SERVICE_TEST
        );
    });

    describe("Fonctions basiques", () => {
        it("devrait stocker une citation", async () => {
            const quote = "Bonjour le monde!";
            await greetingCard.storeQuote(quote, { from: owner });
            
            const storedQuote = await greetingCard.retrieveQuote(owner);
            assert.equal(storedQuote, quote, "La citation stockée ne correspond pas");
        });

        it("devrait récupérer une citation vide pour une nouvelle adresse", async () => {
            const quote = await greetingCard.retrieveQuote(recipient);
            assert.equal(quote, "", "La citation devrait être vide");
        });
    });

    describe("Événements", () => {
        it("devrait émettre un événement QuoteStored", async () => {
            const quote = "Test d'événement";
            const result = await greetingCard.storeQuote(quote, { from: owner });
            
            assert.equal(result.logs.length, 1, "Un événement devrait être émis");
            assert.equal(result.logs[0].event, "QuoteStored", "L'événement QuoteStored devrait être émis");
            assert.equal(result.logs[0].args.quote, quote, "La citation dans l'événement ne correspond pas");
        });
    });
}); 