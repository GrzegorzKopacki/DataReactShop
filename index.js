const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001
const path = require("path");



// Serwowanie statycznych plików z folderu 'public'
server.use(jsonServer.static("public"));

// Endpoint dla ścieżki root
server.get("/", (req, res) => {
	res.send("Hello, World!");
});

const readData = (callback) => {
	const dbPath = path.join(__dirname, "db.json");
	fs.readFile(dbPath, "utf8", (err, data) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.parse(data));
		}
	});
};

// Funkcja pomocnicza do zapisu danych do pliku db.json
const writeData = (data, callback) => {
	const dbPath = path.join(__dirname, "db.json");
	fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8", (err) => {
		callback(err);
	});
};


// Endpointy dla różnych zasobów
server.get("/women", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.women || []);
	});
});

server.get("/men", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.men || []);
	});
});

server.get("/children", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.children || []);
	});
});

server.get("/products", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.products || []);
	});
});

server.get("/favourites", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		res.json(data.favourites || []);
	});
});



// Endpointy dla bestsellerów w różnych kategoriach
server.get("/women/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		const womenBestsellers = data.women.bestsellers || [];
		res.json(womenBestsellers);
	});
});

server.post("/favourites", (req, res) => {
	const { productId } = req.body;
	if (!productId) {
		return res.status(400).send("Product ID is required");
	}

	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}

		const product = data.products.find((p) => p.id === productId);
		if (!product) {
			return res.status(404).send("Product not found");
		}

		data.favourites.push(product);
		writeData(data, (err) => {
			if (err) {
				return res.status(500).send("Error writing to database file.");
			}
			res.status(201).send("Product added to favourites");
		});
	});
});

server.get("/men/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		const menBestsellers = data.men.bestsellers || [];
		res.json(menBestsellers);
	});
});

server.get("/children/bestsellers", (req, res) => {
	readData((err, data) => {
		if (err) {
			return res.status(500).send("Error reading database file.");
		}
		const childrenBestsellers = data.children.bestsellers || [];
		res.json(childrenBestsellers);
	});
});

server.get("/bestsellers", (req, res) => {
    readData((err, data) => {
        if (err) {
            return res.status(500).send("Error reading database file.");
        }

        const bestsellers = {
            women: data.women.bestsellers || [],
            men: data.men.bestsellers || [],
            children: data.children.bestsellers || []
        };

        res.json(bestsellers);
    });
});

server.use(middlewares);
server.use(router);

server.listen(port);