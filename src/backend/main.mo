import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    image : Text;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    user : Principal;
    items : [CartItem];
    totalAmount : Nat;
    timestamp : Nat;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, Map.Map<Nat, Nat>>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 1;
  var nextOrderId = 1;

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, image : Text) : async Nat {
    let productId = nextProductId;
    let product : Product = {
      id = productId;
      name;
      description;
      price;
      image;
    };
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public query ({ caller }) func getProduct(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (quantity == 0) { Runtime.trap("Quantity must be greater than 0") };
    let cart = switch (carts.get(caller)) {
      case (null) { Map.empty<Nat, Nat>() };
      case (?existingCart) { existingCart };
    };
    cart.add(productId, quantity);
    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        cart.remove(productId);
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cartMap) {
        let cartItems : Iter.Iter<(Nat, Nat)> = cartMap.entries();
        let items = cartItems.toArray().map(
          func((productId, quantity)) {
            { productId; quantity };
          }
        );
        items;
      };
    };
  };

  public shared ({ caller }) func checkout() : async Nat {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    let cartEntriesIter = cart.entries().toArray();

    if (cartEntriesIter.size() == 0) {
      Runtime.trap("Cart is empty. Cannot proceed to checkout.");
    };

    let items : [CartItem] = cartEntriesIter.map(
      func((productId, quantity)) {
        { productId; quantity };
      }
    );

    var totalAmount = 0;
    for ((productId, quantity) in cartEntriesIter.values()) {
      switch (products.get(productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) {
          totalAmount += product.price * quantity;
        };
      };
    };

    let orderId = nextOrderId;
    let order : Order = {
      id = orderId;
      user = caller;
      items;
      totalAmount;
      timestamp = 0;
    };
    orders.add(orderId, order);
    carts.remove(caller);
    nextOrderId += 1;
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };
};
