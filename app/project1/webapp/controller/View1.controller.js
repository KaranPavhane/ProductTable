sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "jquery.sap.global"
], (Controller, JSONModel, MessageToast, $) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
            const oJsonModel = new sap.ui.model.json.JSONModel({
                ProductCollection: [],
                uniqueBrands: [],
                uniqueCategory: [],
                product: {}
            });
            this.getView().setModel(oJsonModel, "obj");

            this._loadProductData();
        },

        _loadProductData() {
            const oView = this.getView();
            const oJsonModel = oView.getModel("obj");
            const oComponentModel = this.getOwnerComponent().getModel();

            const serviceUrl = oComponentModel.sServiceUrl || oComponentModel.getServiceUrl?.();
            console.log("Service URL:", serviceUrl);

            $.ajax({
                url: `${serviceUrl}/Product`,
                method: "GET",
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    const aProducts = response.value || response.d?.results || [];
                    console.log("Product data loaded:", aProducts);

                    oJsonModel.setProperty("/ProductCollection", aProducts);

                    const uniqueBrands = [
                        ...new Set(aProducts.map((p) => p.brandName))
                    ]
                        .filter(Boolean)
                        .map((brand) => ({ brandName: brand }));

                    const uniqueCategory = [
                        ...new Set(aProducts.map((p) => p.category))
                    ]
                        .filter(Boolean)
                        .map((category) => ({ category: category }));



                    oJsonModel.setProperty("/uniqueBrands", uniqueBrands);
                    oJsonModel.setProperty("/uniqueCategory", uniqueCategory);

                    console.log("Unique brand names:", uniqueBrands);
                    console.log("Unique category names:", uniqueCategory);

                    sap.m.MessageToast.show("Product data loaded successfully");
                },
                error: (err) => {
                    console.error("Error fetching Product data:", err);
                    sap.m.MessageToast.show("Failed to load Product data");
                }
            });
        },

        onAddProduct() {
            const oModel = this.getView().getModel("obj");
            const aProducts = oModel.getProperty("/ProductCollection") || [];

            const oNewProduct = {
                productId: "",
                productCode: "",
                productName: "",
                description: "",
                category: "",
                brandName: "",
                unitOfMeasure: "",
                weight: "",
                mrp: "",
                discountPercent: "",
                gstPercent: "",
                stockQuantity: "",
                reorderLevel: "",
                expiryDate: "",
                manufacturedDate: "",
                ownerId: "",
                isNew: true
            };

            aProducts.unshift(oNewProduct);
            oModel.setProperty("/ProductCollection", aProducts);
        },

        onSaveProduct() {
            const oModel = this.getView().getModel("obj");
            const aProducts = oModel.getProperty("/ProductCollection") || [];
            const aNewProducts = aProducts.filter(prod => prod.isNew);

            if (aNewProducts.length === 0) {
                sap.m.MessageToast.show("No new product to save!");
                return;
            }

            const oComponentModel = this.getOwnerComponent().getModel();
            const serviceUrl = oComponentModel.getServiceUrl();
            console.log("Service url : ", serviceUrl);
           
            aNewProducts.forEach(product => {
                const convertToISO = (dateStr) => {
                    if (!dateStr) return null;
                    const d = new Date(dateStr);
                    if (!isNaN(d)) return d.toISOString().split("T")[0];
                    const parts = dateStr.split(/[\/\-]/);
                    if (parts[2].length === 2) parts[2] = "20" + parts[2];
                    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
                };


                if (!product.brandName) {
                    sap.m.MessageToast.show("Please Enter Brand Name");
                    return;
                }

                if (!product.category) {
                    sap.m.MessageToast.show("Please Enter Category");
                    return;
                }

                if (!product.productName) {
                    sap.m.MessageToast.show("Please Enter Product Name");
                    return;
                }

                if (!product.productCode) {
                    sap.m.MessageToast.show("Please Enter Product Code");
                    return;
                }

                if (!product.description) {
                    sap.m.MessageToast.show("Please Enter Description");
                    return;
                }

                if (!product.unitOfMeasure) {
                    sap.m.MessageToast.show("Please Enter Unit of Measure");
                    return;
                }

                if (!product.weight) {
                    sap.m.MessageToast.show("Please Enter Weight");
                    return;
                }

                if (!product.mrp) {
                    sap.m.MessageToast.show("Please Enter MRP");
                    return;
                }

                if (!product.discountPercent) {
                    sap.m.MessageToast.show("Please Enter Discount Percent");
                    return;
                }

                if (!product.gstPercent) {
                    sap.m.MessageToast.show("Please Enter GST Percent");
                    return;
                }

                if (!product.stockQuantity) {
                    sap.m.MessageToast.show("Please Enter Stock Quantity");
                    return;
                }

                if (!product.reorderLevel) {
                    sap.m.MessageToast.show("Please Enter Reorder Level");
                    return;
                }

                if (!product.expiryDate) {
                    sap.m.MessageToast.show("Please Enter Expiry Date");
                    return;
                }

                if (!product.manufacturedDate) {
                    sap.m.MessageToast.show("Please Enter Manufactured Date");
                    return;
                }

                const productPayload = {
                    brandName: product.brandName,
                    category: product.category,
                    productName: product.productName,
                    productCode: product.productCode,
                    description: product.description,
                    unitOfMeasure: product.unitOfMeasure,
                    weight: Number(product.weight),
                    mrp: Number(product.mrp),
                    discountPercent: Number(product.discountPercent),
                    gstPercent: Number(product.gstPercent),
                    stockQuantity: Number(product.stockQuantity),
                    reorderLevel: Number(product.reorderLevel),
                    expiryDate: convertToISO(product.expiryDate),
                    manufacturedDate: convertToISO(product.manufacturedDate),
                  
                };

                console.log("Payload for post : ", productPayload);

                $.ajax({
                    url: `${serviceUrl}/Product`,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(productPayload),
                    success: (response) => {
                        const savedProduct = response.value || response;

                        // const brandName=savedProduct.brandName;
                        // const productName=savedProduct.productName;

                        // console.log("Product Name : ",productName);
                        this.byId("brandNameId").setValue(savedProduct.brandName);
                        this.byId("categoryId").setValue(savedProduct.category);
                        this.byId("productIdId").setValue(savedProduct.productId);

                        this.byId("productNameId").setValue(savedProduct.productName);
                        this.byId("productCodeId").setValue(savedProduct.productCode);
                        this.byId("mrpId").setValue(savedProduct.mrp);
                        this.byId("stockQuantityId").setValue(savedProduct.stockQuantity);
                        this.byId("manufacturedDateId").setValue(savedProduct.manufacturedDate);
                        this.byId("expiryDateId").setValue(savedProduct.expiryDate);
                        this.byId("weightId").setValue(savedProduct.weight);
                        this.byId("unitOfMeasureId").setValue(savedProduct.unitOfMeasure);
                        this.byId("descriptionId").setValue(savedProduct.description);
                        this.byId("discountPercentId").setValue(savedProduct.discountPercent);
                        this.byId("gstPercentId").setValue(savedProduct.gstPercent);


                        product.isNew = false;

                        sap.m.MessageToast.show(`Product "${savedProduct.productName}" saved Succesfully`);
                    },

                    error: (err) => {
                        console.error("Error saving product:", err);

                        sap.m.MessageToast.show("Error saving product");
                    }
                });
            });
        }


    });
});
