import { Injectable, NotFoundException, forwardRef, Inject} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}

     async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
      const createdProduct = new this.productModel({ ...createProductDto, userId });
      return createdProduct.save();
    }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }
    await this.productModel.findByIdAndDelete(id);
  }
}
