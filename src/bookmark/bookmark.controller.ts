import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { JwtGaurd } from '../auth/gaurd';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGaurd)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarksService: BookmarkService) {}

    @Get()
    getBookmarks(@GetUser('id') userId:number) {
        return this.bookmarksService.getBookmarks(
            userId,
            );
    };

    @Get(':id')
    getBookmarkById(
        @GetUser('id') userId:number, 
        @Param('id', ParseIntPipe) bookmarkId:number
        ) {
            return this.bookmarksService.getBookmarkById(
                userId,
                bookmarkId,
            );
        }

    @Post()
    createBookmark(
        @GetUser('id') userId:number,
        @Body() dto: CreateBookmarkDto,
    ) {
        return this.bookmarksService.createBookmark(
            userId,
            dto
        );
    }

    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userId:number,
        @Param('id', ParseIntPipe) bookmarkId:number,
        @Body() dto: EditBookmarkDto,
    ) {
        return this.bookmarksService.editBookmarkById(
            userId,
            bookmarkId,
            dto,
        );
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userId:number,
        @Param('id', ParseIntPipe) bookmarkId:number
        ) {
            return this.bookmarksService.getBookmarkById(
                userId,
                bookmarkId,
            );
        }

}
