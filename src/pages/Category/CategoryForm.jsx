import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryForm = ({ showModal, handleClose, product }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoriaId: product ? product.categoriaId?.toString() : "1"
    }
  });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios
      .get("https://backend-test-virid.vercel.app/api/categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => console.error(error));
  }, []);


  const onSubmit = (data) => {
    data.id = parseInt(data.id);
    if (product) {
      // Actualización del producto
      axios
        .put(
          `https://backend-test-virid.vercel.app/api/categorias/${product.id}`,
          data
        )
        .then((response) => {
          console.log(response.data);
          toast.success("El producto se ha actualizado correctamente.");
          handleClose();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Hubo un error al actualizar el producto");
        });
    } else {
      // Creación de la Categoria
      axios
        .post("https://backend-test-virid.vercel.app/api/categorias", data)
        .then((response) => {
          console.log(response.data);
          toast.success("El producto se ha creado correctamente.");

          handleClose();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Hubo un error al crear el producto");
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {product ? "Editar Categoria" : "Agregar Categoria"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="productName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                {...register("nombre", { required: true })}
                defaultValue={product ? product.nombre : ""}
              />
              {errors.nombre && <span>El nombre es requerido</span>}
            </Form.Group>

            <Button
              style={{ marginTop: "10px" }}
              variant="primary"
              type="submit"
            >
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );


};

export default CategoryForm;