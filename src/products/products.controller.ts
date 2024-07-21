import { Controller, Get, Post, Body, Param, UseGuards} from '@nestjs/common';
import { CurrentUser } from '../auth/get-user.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@CurrentUser() user,@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto , user.userId);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }
  
}
