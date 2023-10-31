import { Injectable } from '@angular/core';
import { Observable, from, map, take } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    QueryFn,
} from '@angular/fire/compat/firestore';

interface DocumentPathSegment {
    collectionName: CollectionName;
    documentId?: string;
}

export interface BaseModel {
    id: string;
}

export type CollectionName = string;

export type Segment = [string, string?];

export type DocumentPath = CollectionName | Segment | Segment[];

@Injectable({ providedIn: 'root' })
export class FireStoreService {
    constructor(private readonly firestore: AngularFirestore) { }

    getCollectionStream(
        documentPath: DocumentPath,
        queryFn?: QueryFn
    ): Observable<any[]> {
        const itemCollection = this.getFirestoreCollection<any>(
            documentPath,
            queryFn
        );
        return itemCollection.valueChanges();
    }

    getCollection<T extends BaseModel>(
        documentPath: DocumentPath,
        queryFn?: QueryFn
    ): Observable<T[]> {
        return this.getCollectionStream(documentPath, queryFn).pipe(take(1));
    }

    getFirstDocument<T extends BaseModel>(
        documentPath: DocumentPath,
        queryFn?: QueryFn
    ): Observable<T | undefined> {
        return this.getCollection<T>(documentPath, queryFn).pipe(
            map((items) => {
                return items[0];
            })
        );
    }

    getDocument<T extends BaseModel>(
        documentPath: Exclude<DocumentPath, CollectionName>
    ): Observable<T | undefined> {
        const document = this.getFirestoreDocument<T>(documentPath);
        return document.valueChanges().pipe(take(1));
    }

    // !Known issues: this will trigger changes in getCollectionStream 2 times
    createDocument<T extends BaseModel>(
        documentPath: DocumentPath,
        item: T
    ): Observable<T> {
        const itemCollection = this.getFirestoreCollection<T>(documentPath);
        const document = itemCollection.doc();

        item.id = document.ref.id;
        const addPromise = document.set(item);
        return from(addPromise).pipe(map(() => item));
    }

    // !Known issues: this will trigger changes in getCollectionStream 2 times
    updateDocument<T extends BaseModel>(
        documentPath: Exclude<DocumentPath, CollectionName>,
        updatedData: T
    ): Observable<void> {
        const document = this.getFirestoreDocument(documentPath);
        const { id: _, ...allowedData } = updatedData;
        const updatePromise = document.update(allowedData);
        return from(updatePromise);
    }

    deleteDocument(
        documentPath: Exclude<DocumentPath, CollectionName>
    ): Observable<void> {
        const document = this.getFirestoreDocument(documentPath);
        const deletePromise = document.delete();
        return from(deletePromise);
    }

    private getFirestoreCollection<T extends BaseModel>(
        documentPath: DocumentPath,
        queryFn?: QueryFn
    ): AngularFirestoreCollection<T> {
        let pathSegments: DocumentPathSegment[] | null = Array.isArray(
            documentPath[0]
        )
            ? (documentPath as Segment[]).map((x) => ({
                collectionName: x[0],
                documentId: x[1],
            }))
            : null;
        if (pathSegments === null) {
            pathSegments =
                typeof documentPath === 'string'
                    ? [{ collectionName: documentPath, documentId: undefined }]
                    : ([
                        { collectionName: documentPath[0], documentId: documentPath[1] },
                    ] as DocumentPathSegment[]);
        }

        const segmentsLength = pathSegments.length;
        if (segmentsLength === 0) {
            throw new Error('At least 1 collection must be specified');
        }

        if (
            pathSegments.some(
                (segment, _, items) =>
                    !segment.documentId && items.indexOf(segment) !== segmentsLength - 1
            )
        ) {
            throw new Error(
                'Only last segment can leave documentId with undefined value'
            );
        }

        const parentDocument = pathSegments
            .slice(0, segmentsLength - 1)
            .reduce((prevDocument, currentSegment) => {
                const collection =
                    prevDocument === null
                        ? this.firestore.collection(currentSegment.collectionName)
                        : prevDocument.collection(currentSegment.collectionName);
                return collection.doc(currentSegment.documentId);
            }, null as AngularFirestoreDocument<T> | null);

        const lastSegment = pathSegments[segmentsLength - 1];
        const targetCollection =
            parentDocument !== null
                ? parentDocument.collection(lastSegment.collectionName, queryFn)
                : this.firestore.collection(lastSegment.collectionName, queryFn);
        return targetCollection as AngularFirestoreCollection<T>;
    }

    private getFirestoreDocument<T extends BaseModel>(
        documentPath: Exclude<DocumentPath, CollectionName>
    ): AngularFirestoreDocument<T> {
        const collection = this.getFirestoreCollection(documentPath);
        const lastSegment = (
            Array.isArray(documentPath[0])
                ? documentPath[documentPath.length - 1]
                : documentPath
        ) as Segment;
        const documentId = lastSegment[1];
        if (!documentId) {
            throw new Error('A document ID must be specified.');
        }
        return collection.doc(documentId);
    }
}
